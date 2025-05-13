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

/// function to get the crs id  and country name
const getTheCrsId = async(oyo_id)=>{
    try {
        const response = await db.query('SELECT * FROM property where oyo_id = $1', [oyo_id]);
        console.log(response.rows[0]?.property_id, response.rows[0]?.country)
        return [response.rows[0]?.property_id, response.rows[0]?.country];
    } catch (error) {
        console.log(error)
        return [null, null];
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
        return response.rows[0]?.id;
    } catch (error) {
        console.log(error)
        return null;
    }
}

/// final function to update room_dimension
const updateTheRoomDimension = async(property_id, room_category_id, room_dimension)=>{
    try {
        const response = await db.query(`SELECT * FROM property_room_category_amenity_lists where property_id=$1 and room_category_id=$2`, [property_id, room_category_id]);
        console.log("The initial value of the dimension column is : ", response.rows[0]?.dimension)
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
            return true;
        } else {
            console.log('No matching record found to update');
            return false;
        }
    } catch (error) {
        console.log('Error updating room dimension:', error);
        return false;
    }
}

/////-----------------Input section-------------------------------

const oyo_id = 'UAE_FJR009'
const room_category_name = 'deluxe queen'
const room_dimension = 209  // Example dimension value

// Main execution function
const main = async () => {
    try {
        // Get property details
        const [property_id, country] = await getTheCrsId(oyo_id);
        if (!property_id || !country) {
            console.log('Failed to get property details');
            return;
        }

        // Get room category ID
        const room_category_id = await getRoomCategoryId(room_category_name, country);
        if (!room_category_id) {
            console.log('Failed to get room category ID');
            return;
        }

        // Update room dimension
        const updateSuccess = await updateTheRoomDimension(property_id, room_category_id, room_dimension);
        if (!updateSuccess) {
            console.log('Failed to update room dimension');
            return;
        }

        console.log('All operations completed successfully');
    } catch (error) {
        console.log('Error in main execution:', error);
    } finally {
        // Close database connection
        await db.end();
    }
}

// Execute the main function
main();