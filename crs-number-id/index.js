import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})
db.connect()

const getTheCrsId = async(oyo_id)=>{
    try {
        const response = await db.query('SELECT * FROM property where oyo_id = $1', [oyo_id]);
        return response.rows[0]?.property_id
    } catch (error) {
        console.log(error)
    }
}



// ---------------- input section---------------
const oyo_id = 'UAE_DUB945'
const id = await getTheCrsId(oyo_id)
console.log(id)