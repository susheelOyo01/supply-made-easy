import axios from 'axios'
import fs from 'fs'

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
        console.log(body)
        fs.writeFileSync('./msg.txt', JSON.stringify(body, null, 2))
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

const contractId = "PC-977d7ee6-8c95-4824-9ba7-99ec2bd61f29";
const oyo_id="UAE_DUB945"
const property_id="PROPERTY_4503d1b0-c2d8-432f-8d69-75760110da96"

onceHitForfiet(contractId, oyo_id, property_id)