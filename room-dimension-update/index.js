import pg from 'pg'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

//db connection 
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})
db.connect()

// apis 
let country = ''
let property_id = 0;
let room_category_id =0;

/// function to get the crs id  and country name
const getTheCrsId = async(oyo_id)=>{
    try {
        const response = await db.query('SELECT * FROM property where oyo_id = $1', [oyo_id]);
        console.log(response.rows[0]?.property_id, response.rows[0]?.country)
        property_id = response.rows[0]?.property_id
        country = response.rows[0]?.country
        getRoomCategoryId(room_category_name,country)
    } catch (error) {
        console.log(error)
    }
}

// function to get room_category_id according to country
const getRoomCategoryId = async(room_category_name, country)=>{
    try {
        const response = await db.query(
            "SELECT * FROM room_categories where name ilike $1 and code ilike $2", 
            [room_category_name, `%${country}%`]
        );
        console.log(response.rows[0]?.id);
        room_category_id=response.rows[0]?.id
        if(response.rows[0]?.id){
            updateTheRoomDimension(property_id,room_category_id, room_dimension);
        }
    } catch (error) {
        console.log(error)
    }
}

/// final function to update room_dimension
const updateTheRoomDimension = async(property_id, room_category_id, room_dimension)=>{
    try {
        const response = await db.query(`SELECT * FROM property_room_category_amenity_lists where property_id=$1 and room_category_id=$2`, [property_id, room_category_id]);
        console.log("The initail value of the dimension column is : ", response.rows[0]?.dimension)
        if(response.rows[0]){
            const update = await db.query(
                `UPDATE property_room_category_amenity_lists 
                SET dimension = $3 
                WHERE property_id = $1 AND room_category_id = $2`,
                [property_id, room_category_id, room_dimension]
            );
            console.log('Room dimension updated successfully:', update);
            const check = await db.query(`SELECT * FROM property_room_category_amenity_lists where property_id=$1 and room_category_id=$2`,[property_id, room_category_id])
            console.log("The room_dimension has been updated to : ", check.rows[0]?.dimension)
            return null
        } else {
            console.log('No matching record found to update');
        }
    } catch (error) {
        console.log('Error updating room dimension:', error);
    }
}

/////-----------------Input section-------------------------------

const oyo_id = 'UAE_FJR009'
const room_category_name = 'deluxe queen'
const room_dimension = 209  // Example dimension value

// starting point for function call
getTheCrsId(oyo_id)