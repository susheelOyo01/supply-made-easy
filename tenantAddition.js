import { hitAndClear } from "./clear-property-detail-cache/index.js";
import { getTheCrsId } from "./utils/camsHelper.js";
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()
import axios from "axios";

const db = new pg.Client({
    user: process.env.CAMS_DB_USER,
    host: process.env.CAMS_DB_HOST,
    database: process.env.CAMS_DB_NAME,
    password: process.env.CAMS_DB_PASSWORD,
    port: process.env.CAMS_DB_PORT,
})
db.connect()


//tenant addition
const addTenant = async (tenant, propertyId)=>{
    try {
        const response = await axios.post(
            `http://zp-cams-async-api-1.supply.internal.oyorooms.io/property/add-tenants?oyo_id=${propertyId}`,
            [tenant],
            {
                headers: {
                    'access_token': 'ZDNWcVFtOXBqenFyQld4eVZEdHI6S2N6OEF6elNFQ3lBOHZCWnJDaDg=',
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data)
    } catch (error) {
        console.error('Error adding tenant:', error.message);
        throw error;
    }
}




//-------------input section---------------
const tenant = "OYO"
const hotel_id= "CRT159"


// ------main function call
async function main(){
    try {
        console.log("Getting property ID...");
        const res = await getTheCrsId(hotel_id);
        const propertyId = await res?.property_id
        if(propertyId == null){
            console.log("Failed to get property ID");
            return;
        }
        console.log("Property ID retrieved:", propertyId);

        console.log("Adding tenant...");
        const response = await addTenant(tenant, propertyId);
        console.log("Tenant addition response:", response);

        console.log("Triggering kafka...");
        const kafkaTrigger = await hitAndClear(propertyId);
        console.log("Kafka trigger response:", kafkaTrigger);

        console.log("All operations completed successfully!");
    } catch (error) {
        console.error("Error in main process:", error.message);
        throw error;
    }
}

// Execute the main function
main().catch(error => {
    console.error("Process failed:", error);
    process.exit(1);
});

