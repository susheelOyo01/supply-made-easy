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
            `SELECT count(*) FROM property_images WHERE property_id=$1 AND priority=$2 AND status=0`,
            [property_id, priority]
        );
        console.log(response.rows[0]?.count)
        if (!response.rows[0]) {
            console.log("No image found with the specified priority");
            return null;
        }

        const updateResponse = await db.query(
            `UPDATE property_images 
             SET status = 1 
             WHERE property_id=$1 AND priority=$2 AND status=0 
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
const oyo_id = 'SRT321'
const priority = [30529,36572,1689 ,30492 ,30601 ,1745 ]


// main function call
const main = async()=>{
    try {
        for(let i = 0; i< priority.length; i++){
            const id = await getTheCrsId(oyo_id)
            const property_id = id
            if(!property_id){
                console.log("Property not found")
                return
            }
            const res = await updateTheImagePriority(property_id, priority[i])
            if (res) {
                console.log(`Successfully updated image priority ${priority[i]}`)
            }
        }
    } catch (error) {
        console.log("Error in main function:", error)
    } finally {
        await db.end()
    }
}

main()