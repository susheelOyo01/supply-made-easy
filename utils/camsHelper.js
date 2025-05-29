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

export const getTheCrsId = async(oyo_id)=>{
    try {
        const response = await db.query('SELECT * FROM property where oyo_id = $1', [oyo_id])
        return response.rows[0]
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getRoomCategoryId = async(property_id, room_category_name)=>{
    try {
        const response = await db.query(
            `SELECT rc.id 
             FROM property_room_category_amenity_lists prcal
             JOIN room_categories rc ON prcal.room_category_id = rc.id
             WHERE prcal.property_id = $1 
             AND rc.name ILIKE $2`,
            [property_id, `%${room_category_name}%`]
        );
        
        console.log(response.rows[0]?.id)
        return response.rows[0]?.id;
    } catch (error) {
        console.log("Error in getRoomCategoryId:", error);
        return null;
    }
}

