import { getTheCrsId } from "./utils/camsHelper.js"

// ---------------- input section---------------
const oyo_id = 'KOL069'




// main function call
const id = await getTheCrsId(oyo_id)
console.log(id?.property_id)