import { getTheCrsId } from "./utils/camsHelper.js"

// ---------------- input section---------------
const oyo_id = 'HYD2419'



// main function call
const id = await getTheCrsId(oyo_id)
console.log(id)