// this is the same script but for multiple properties
import axios from "axios"
import fs from 'fs'

const hitAndClear = async(property_list)=>{
    try {
        // First API call for all properties
        const firstApiPromises = property_list.map(async(property_id) => {
            try {
                const response = await axios.get(`http://zp-cams-async-api-1.supply.internal.oyorooms.io/test/clear-property-details-cache?hotel_ids=${property_id}`, {
                    headers: {
                        'oyo-client': 'ownerDelight',
                        'x-api-key': 'ownerDelightPassword'
                    }
                })
                console.log(`Property ${property_id} - First API Response:`, response.data)
                return response.data
            } catch (error) {
                console.log(`Property ${property_id} - First API Error:`, error)
                return null
            }
        })

        // Wait for all first API calls to complete
        console.log("Waiting for all first API calls to complete...")
        await Promise.all(firstApiPromises)
        console.log("All first API calls completed")

        // Second API call for all properties
        const secondApiPromises = property_list.map(async(property_id) => {
            try {
                const nextHit = await axios.get(`http://cams-async-api.supply.internal.oyorooms.io/kafka/sync_hotel_search?hotel_id=${property_id}`,{
                    headers:{
                        'access_token': 'ZnNta3YzQ1Jkbi1fZGRLZUpXZGU6Z2d0alYybms0d1RncktSd0VpUVo='
                    }
                })
                console.log(`Property ${property_id} - Second API Response:`, nextHit.data)
                return nextHit.data
            } catch (error) {
                console.log(`Property ${property_id} - Second API Error:`, error)
                return null
            }
        })

        // Wait for all second API calls to complete
        console.log("Waiting for all second API calls to complete...")
        await Promise.all(secondApiPromises)
        console.log("All second API calls completed")

    } catch (error) {
        console.log("Main error:", error)
    }
}


// .input list section
try {
    const propertyListContent = fs.readFileSync('./property_list.txt', 'utf8')
    const property_list = propertyListContent.split('\n')
        .map(line => line.trim())
        .filter(line => line)
    
    if (property_list.length === 0) {
        console.error('No property IDs found in property_list.txt')
        process.exit(1)
    }
    
    console.log(`Found ${property_list.length} properties to process`)
    hitAndClear(property_list)
} catch (error) {
    console.error('Error reading property_list.txt:', error.message)
    process.exit(1)
}