import fs from 'fs';
import csv from 'csv-parser';
import { getRoomCategoryId, getTheCrsId } from '../utils/camsHelper.js';
import { hitAndClear } from '../clear-property-detail-cache/index.js';
import { updateTheRoomDimension } from './room_dimension_update.js';

// Function to read and parse CSV file
const readCSVFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Process single room dimension update
const processRoomUpdate = async (oyo_id, room_category_name, room_dimension) => {
    try {
        console.log(`\nProcessing update for oyo_id: ${oyo_id}, room: ${room_category_name}`);
        
        // Get property ID
        const res = await getTheCrsId(oyo_id);
        const property_id = res?.property_id;
        const country = res?.country;
        
        if (!property_id || !country) {
            console.error(`Failed to get property details for oyo_id: ${oyo_id}`);
            return {
                oyo_id,
                room_category_name,
                status: 'failed',
                error: 'Property details not found'
            };
        }

        // Get room category ID
        const room_category_id = await getRoomCategoryId(property_id, room_category_name);
        if (!room_category_id) {
            console.error(`Failed to get room category ID for ${room_category_name}`);
            return {
                oyo_id,
                room_category_name,
                status: 'failed',
                error: 'Room category not found'
            };
        }

        // Update room dimension
        const updateSuccess = await updateTheRoomDimension(property_id, room_category_id, room_dimension);
        if (!updateSuccess) {
            return {
                oyo_id,
                room_category_name,
                status: 'failed',
                error: 'Failed to update room dimension'
            };
        }

        // Clear cache
        await hitAndClear(property_id);

        return {
            oyo_id,
            room_category_name,
            property_id,
            room_category_id,
            status: 'success'
        };
    } catch (error) {
        console.error(`Error processing update for ${oyo_id}:`, error.message);
        return {
            oyo_id,
            room_category_name,
            status: 'failed',
            error: error.message
        };
    }
};

// Main function to process all updates
async function main() {
    try {
        const inputFile = './file.csv';
        console.log('Reading CSV file...');
        
        // Read CSV file
        const records = await readCSVFile(inputFile);
        console.log(`Found ${records.length} records to process`);
        
        // Process each record
        const results = [];
        for (const record of records) {
            if (!record.oyo_id || !record.room_category_name || !record.room_dimension) {
                console.error('Invalid record:', record);
                results.push({
                    oyo_id: record.oyo_id || 'unknown',
                    room_category_name: record.room_category_name || 'unknown',
                    status: 'failed',
                    error: 'Missing required fields'
                });
                continue;
            }
            
            const result = await processRoomUpdate(
                record.oyo_id,
                record.room_category_name,
                parseInt(record.room_dimension)
            );
            results.push(result);
        }
        
        // Generate summary
        const successful = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'failed').length;
        
        console.log('\nProcessing Summary:');
        console.log(`Total records: ${records.length}`);
        console.log(`Successful: ${successful}`);
        console.log(`Failed: ${failed}`);
        
        // Save detailed results
        fs.writeFileSync('room_dimension_update_results.json', JSON.stringify(results, null, 2));
        console.log('\nDetailed results have been saved to room_dimension_update_results.json');
        
    } catch (error) {
        console.error('Error in main process:', error.message);
        process.exit(1);
    }
}

// Execute the main function
main().catch(error => {
    console.error('Process failed:', error);
    process.exit(1);
}); 