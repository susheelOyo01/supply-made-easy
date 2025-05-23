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

export const getRoomCategoryId = async(room_category_name, country)=>{
    try {
        const response = await db.query(
            "SELECT * FROM room_categories where name ilike $1 and code ilike $2", 
            [room_category_name, `%${country}%`]
        );
        console.log(response.rows[0]?.id);
        return response.rows[0]?.id;
    } catch (error) {
        console.log(error)
        return null;
    }
}