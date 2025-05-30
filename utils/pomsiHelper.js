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


// property publish failed status 1: rs_percentage
export const checkIfRsError = async (leadId)=>{
    try {
        const res = await db.query("SELECT * FROM leads where id=$1", [leadId])
        console.log(res.rows[0])
        return res.rows[0]?.status
    } catch (error) {
        console.log(error)
    }
}

// get the propertyId from existing_oyo_id
export const getPropertyCode = async(oyo_id)=>{
    try {
        const res = await db.query("Select property_id from leads where existing_oyo_oyoid=$1",[oyo_id])
        console.log(res.rows[0])
        return res.rows[0]
    } catch (error) {
        console.log(error)
    }
}

