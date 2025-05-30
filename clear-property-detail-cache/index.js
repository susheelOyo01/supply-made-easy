import axios from "axios"


export const hitAndClear = async(property_id)=>{
    try {
        const response = await axios.get(`http://zp-cams-async-api-1.supply.internal.oyorooms.io/test/clear-property-details-cache?hotel_ids=${property_id}`, {
            headers: {
                'oyo-client': 'ownerDelight',
                'x-api-key': 'ownerDelightPassword'
            }
        })
        console.log(response.data)
        const nextHit = await axios.get(`http://cams-async-api.supply.internal.oyorooms.io/kafka/sync_hotel_search?hotel_id=${property_id}`,{
            headers:{
                'access_token': 'ZnNta3YzQ1Jkbi1fZGRLZUpXZGU6Z2d0alYybms0d1RncktSd0VpUVo='
            }
        })
        console.log(nextHit.data)

    } catch (error) {
        console.log(error)
    }
}



const property_id = 304938

hitAndClear(property_id)