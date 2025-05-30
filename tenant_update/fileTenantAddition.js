// here a file containing multiple hotel_id with tenant can be added

import fs from 'fs';
import csv from 'csv-parser';
import { addTenant } from '../tenantAddition.js';
import { hitAndClear } from "../clear-property-detail-cache/index.js";

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

// Process single tenant addition
const processTenant = async (tenant, oyo_id) => {
    try {
        console.log(`\nProcessing tenant: ${tenant} for oyo_id: ${oyo_id}`);
        
        // Add tenant
        await addTenant(tenant, oyo_id);
        
        // Trigger kafka
        await hitAndClear(oyo_id);
        
        return {
            oyo_id,
            tenant,
            status: 'success'
        };
    } catch (error) {
        console.error(`Error processing tenant ${tenant} for oyo_id ${oyo_id}:`, error.message);
        return {
            oyo_id,
            tenant,
            status: 'failed',
            error: error.message
        };
    }
};

// Main function to process all tenants
async function main() {
    try {
        const inputFile = './tenant-data.csv';
        console.log('Reading CSV file...');
        
        // Read CSV file
        const records = await readCSVFile(inputFile);
        console.log(`Found ${records.length} records to process`);
        
        // Process each record
        const results = [];
        for (const record of records) {
            if (!record.tenant || !record.oyo_id) {
                console.error('Invalid record:', record);
                results.push({
                    oyo_id: record.oyo_id || 'unknown',
                    tenant: record.tenant || 'unknown',
                    status: 'failed',
                    error: 'Missing required fields'
                });
                continue;
            }
            
            const result = await processTenant(record.tenant, record.oyo_id);
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
        fs.writeFileSync('tenant_addition_results.json', JSON.stringify(results, null, 2));
        console.log('\nDetailed results have been saved to tenant_addition_results.json');
        
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


