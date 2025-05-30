import pg from 'pg'
import dotenv from 'dotenv'
import { getRoomCategoryId, getTheCrsId } from '../utils/camsHelper.js'
import { hitAndClear } from '../clear-property-detail-cache/index.js'

// Load environment variables
dotenv.config()

//db connection 
const db = new pg.Client({
    user: process.env.CAMS_DB_USER,
    host: process.env.CAMS_DB_HOST,
    database: process.env.CAMS_DB_NAME,
    password: process.env.CAMS_DB_PASSWORD,
    port: process.env.CAMS_DB_PORT,
})
db.connect()



/// final function to update room_dimension
export const updateTheRoomDimension = async(property_id, room_category_id, room_dimension)=>{
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

const oyo_id = 'UAE_DUB936'
const room_category_name = 'Standard One Bedroom apartment'
const room_dimension = 118  

// Main execution function
const main = async () => {
    try {
        const res = await getTheCrsId(oyo_id);
        console.log(res)
        const property_id = res?.property_id
        const country =  res?.country;
        if (!property_id || !country) {
            console.log('Failed to get property details');
            return;
        }

        const room_category_id = await getRoomCategoryId(property_id, room_category_name);
        if (!room_category_id) {
            console.log('Failed to get room category ID');
            return;
        }

        const updateSuccess = await updateTheRoomDimension(property_id, room_category_id, room_dimension);
        if (!updateSuccess) {
            console.log('Failed to update room dimension');
            return;
        }
        console.log("Clearing cache.....")
        const updateOnUi = await hitAndClear(property_id);
        console.log("Cache Cleared!!!")
        console.log('All operations completed successfully');
    } catch (error) {
        console.log('Error in main execution:', error);
    } finally {
        await db.end();
    }
}

// Execute the main function
main();