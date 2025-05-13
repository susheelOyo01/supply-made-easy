import axios from 'axios'
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})
db.connect()


// function to get contractId
const getContractId = async()=>{}

/// function to get the contractId
const getPropertyId = async(oyo_id)=>{
    try {
        const response = await db.query('SELECT * FROM leads where existing_oyo_oyoid=$1',[oyo_id])
        console.log(response.rows[0]);
    } catch (error) {
        console.log(error)
    }
}

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

const oyo_id="UAE_DUB945"

// function call section
const contractId = "PC-977d7ee6-8c95-4824-9ba7-99ec2bd61f29";
const property_id=await getPropertyId(oyo_id)

// onceHitForfiet(contractId, oyo_id, property_id)
getContractId(oyo_id)