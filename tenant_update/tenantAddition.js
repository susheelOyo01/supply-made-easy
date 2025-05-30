import { hitAndClear } from "../clear-property-detail-cache/index.js";
import { getTheCrsId } from "../utils/camsHelper.js";
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
export   const addTenant = async (tenant, propertyId)=>{
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
const hotel_id= "VSN1347"


// ------main function call
async function main() {
    try {
        const propertyId = await getTheCrsId(hotel_id)
        console.log(propertyId)
        console.log("Adding Tenant!")
        await addTenant(tenant, propertyId)
        
        await hitAndClear(propertyId)

    } catch (error) {
        console.log(error)
    }
}
main()