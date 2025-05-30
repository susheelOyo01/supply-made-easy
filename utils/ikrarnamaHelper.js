import pg from 'pg'
import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
dotenv.config()

const db = new pg.Client({
    user: process.env.IKRARNAMA_DB_USER,
    host: process.env.IKRARNAMA_DB_HOST,
    database: process.env.IKRARNAMA_DB_NAME,
    password: process.env.IKRARNAMA_DB_PASSWORD,
    port: process.env.IKRARNAMA_DB_PORT,
})
db.connect()

// contract link db update
export const dbContractUpdate = async(property_id, inputPdfPath) => {
    try {
        // Check if file exists
        if (!fs.existsSync(inputPdfPath)) {
            throw new Error(`PDF file not found at path: ${inputPdfPath}`);
        }

        // Create form data for file upload
        const formData = new FormData();
        const fileStream = fs.createReadStream(inputPdfPath);
        formData.append('file', fileStream, {
            filename: 'contract.pdf',
            contentType: 'application/pdf'
        });

        // Upload contract to Atlas
        const uploadContract = await axios.post(
            'http://atlas.supply.oyorooms.io/atlas/api/v1/upload',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Auth-token': '5cc05786-4e36-42e4-8a22-1ee3a4aa414f'
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        const res = await db.query(
            "UPDATE property_contracts SET contract_link = $1 WHERE property_code = $2 RETURNING *",
            [contractUrl, property_id]
        );

        console.log('Database updated successfully:', res.rows[0]);
        return res.rows[0];
        
    } catch (error) {
        console.error('Error in dbContractUpdate:', error.message);
        throw error;
    } finally {
        // Close the database connection
        await db.end();
    }
}


