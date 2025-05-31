import { getTheCrsId } from "./utils/camsHelper.js"

// ---------------- input section---------------
const oyo_id = 'LNL118'



// main function call
const id = await getTheCrsId(oyo_id)
console.log(id)