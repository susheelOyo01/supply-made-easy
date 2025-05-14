import axios from 'axios'
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const db = new pg.Client({
    user: process.env.POMSI_DB_USER,
    host: process.env.POMSI_DB_HOST,
    database: process.env.POMSI_DB_NAME,
    password: process.env.POMSI_DB_PASSWORD,
    port: process.env.POMSI_DB_PORT,
})
db.connect()

/// function to get the contractId
const getPropertyId = async(oyo_id)=>{
    try {
        const response = await db.query('SELECT * FROM leads where existing_oyo_oyoid=$1',[oyo_id])
        console.log(response.rows[0]?.property_id, response.rows[0]?.metadata.contract_id);
        return [response.rows[0]?.property_id, response.rows[0]?.metadata.contract_id];
    } catch (error) {
        console.log(error)
    }
}

// 
const onceHitForfiet = async (contractId, oyo_id, property_id) =>{
    try {
        let response = await axios.get(`http://ikrarnama.supply.oyorooms.io/cms/api/v1/property_contracts/${contractId}/contract_details/`, {
            headers: {
                'auth-token': '5cc05786-4e36-42e4-8a22-1ee3a4aa414f'
            }
        })
        // console.log(response.data)
        let upperBody= {
            "oyo_id":  `${oyo_id}`,
            "property_id": `${property_id}`,
            "sub_property_type": "Hotel",
            "state": "Transformation",

        }
        const body= {...upperBody, ...response.data}
        const maarC = await axios.post("http://atlas.supply.oyorooms.io/atlas/api/v1/crs/salesforce/syncDataOnCrs", body, {
            headers: {
                'Content-Type': "application/json",
                'auth-token': "5cc05786-4e36-42e4-8a22-1ee3a4aa414f"
            }
        })
        if(maarC.data.status == 422){
            console.log("Unprocessible hit error!");
        }
        console.log(maarC.data)
    } catch (error) {
        console.log("Internal Server error : ", error)
    }
}

//---------------------- input section-------------------------------------
const oyo_id="SA_JDH154"



//Main function call 
async function main(){
    try {
        const [property_id, contract_id] = await getPropertyId(oyo_id);
        if(property_id && contract_id){
            const doMrc = await onceHitForfiet(contract_id,oyo_id,property_id)
        }
    } catch (error) {
        console.log("Error during running apis!", error)
    }
}
main()