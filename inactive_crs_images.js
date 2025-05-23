import { getTheCrsId } from "./utils/camsHelper.js"
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const db = new pg.Client({
    user: process.env.CAMS_DB_USER,
    host: process.env.CAMS_DB_HOST,
    database: process.env.CAMS_DB_NAME,
    password: process.env.CAMS_DB_PASSWORD,
    port: process.env.CAMS_DB_PORT,
})
db.connect()

const updateTheImagePriority = async(property_id, priority)=>{
    try {
        const response = await db.query(
            `SELECT count(*) FROM property_images WHERE property_id=$1 AND priority=$2 AND status=1`,
            [property_id, priority]
        );
        console.log(response.rows[0]?.count)
        if (!response.rows[0]) {
            console.log("No image found with the specified priority");
            return null;
        }

        const updateResponse = await db.query(
            `UPDATE property_images 
             SET status = 0 
             WHERE property_id=$1 AND priority=$2 AND status=1 
             RETURNING *`,
            [property_id, priority]
        );
        
        console.log("Updated image:", updateResponse.rows[0]);
        return updateResponse.rows[0];
    } catch (error) {
        console.log("Error updating image priority:", error);
        return null;
    }
}

//---------------- input section -------------------
const oyo_id = 'AHM254'
const priority = 3002

// main function call
const main = async()=>{
    try {
        const id = await getTheCrsId(oyo_id)
        const property_id = id?.property_id
        if(!property_id){
            console.log("Property not found")
            return
        }
        const res = await updateTheImagePriority(property_id, priority)
        if (res) {
            console.log("Successfully updated image priority")
        }
    } catch (error) {
        console.log(error)
    } finally {
        await db.end()
    }
}

main()