import axios from "axios"

const checkIfRsError = async (leadId) => {
    try {
        const res = await axios.get(`http://poms.supply.oyorooms.io/api/v1/leads/sync_crs?lead_id=${leadId}`, {
            headers: {
                'access_token': "WXFubXJkYjljZHcyV3pCb04xZHk6dEFzNFBmd3g1dHJVZFZ6VFEtLXo6c3NvSWRUVlJOZVU1NlNURk9WMWwwV21wTk5WcHBNREJPTWswelRGUnJORnBYVlhST1Iwa3lXVEpGTVU5RVdtaFBWRUUw"
            }
        })
        console.log('Response:', res.data)

        return res.data
    } catch (error) {
        console.log(error)
    }
}

// ------------input
const leadId = 3180620

// Using async/await properly
async function main() {
    try {
        const result = await checkIfRsError(leadId)
        console.log('Success:', result)
    } catch (error) {
        console.log('Failed to process lead:', error.message)
    }
}

main()