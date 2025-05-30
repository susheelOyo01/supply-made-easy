// in this script I have solved the issue in which contract is uploaded but not visible in lifeline

import { dbContractUpdate } from "./utils/ikrarnamaHelper"
import { getPropertyCode } from "./utils/pomsiHelper"





// ----------------Input section---------------------------

const oyoId = 'SA_AAS004'
const file = './contract.pdf'

async function main(){
    try {
        const res = await getPropertyCode(oyoId)
        if(!res?.property_id){
            console.log("Error fetching propery code!")
        }
        const getRecord = await dbContractUpdate(res?.property_id, file)
    } catch (error) {
        
    }
}