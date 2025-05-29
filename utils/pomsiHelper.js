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



export const checkIfRsError = async (leadId)=>{
    try {
        const res = await db.query("SELECT * FROM leads where id=$1", [leadId])
        console.log(res.rows[0])
        return res.rows[0]?.status
    } catch (error) {
        console.log(error)
    }
}

checkIfRsError(3182318)