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



const contractId = "PC-c03b0c9e-e2af-4d69-a244-0c82f59d67e8";
const oyo_id="LNL333"
const property_id="PROPERTY_79ae7e79-83b4-491c-b9cb-5675e4f91ca7"

onceHitForfiet(contractId, oyo_id, property_id)