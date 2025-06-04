import axios from 'axios'



const updateTheProfile = async(userProfileId,type, typeValue)=>{

    let bodyOne={
        "update_flag": "true",
        "query_list": {
            "global": {},
            "user_profile_id": [
                `${userProfileId}`
            ]
        },
        "update_list": {
            "global": {},
            [type]: [
                type === "email" ? `${typeValue}`:`${typeValue}`
            ]
        }
    }
    let bodyTwo = {

        "update_flag": "true",
        
        "query_list": {
        
        "global": {
        
        },
        
        "user_profile_id": [userProfileId]
        
        },
        
        "update_list": {
        
        "global": {
        
        },
        
        "user_profile_id": [userProfileId],
        
        [type]: [
            type == 'email'?`${typeValue}`:`${typeValue}`
        ]
        
        }
        
        }
    try {
        const resOne = await axios.post("http://c-identity-api.inc.oyorooms.io/api/v2/batch/user_profiles",bodyOne,{
            headers:{
                'Authorization': 'dUxaRnA5NWJyWFlQYkpQNnEtemo6bzdvX01KLUNFbnRyS3hfdEgyLUE=',
                'Content-Type': 'application/json',
                'access_token': 'WXFubXJkYjljZHcyV3pCb04xZHk6dEFzNFBmd3g1dHJVZFZ6VFEtLXo6ZTFhV2ZnZ29WVVc0Y1hmVFF2blBMZzp2aXBpbi5rdW1hcjVAb3lvcm9vbXMuY29t',
                'x-authentication-token': 'e1aWfggoVUW4cXfTQvnPLg',
                'Cookie': 'request_method=PUT; request_method=POST; request_method=POST; request_method=POST'
            }
        })
        console.log(resOne.data)
        
        const resTwo = await axios.post("http://c-identity-api.inc.oyorooms.io/api/v2/batch/users",
            bodyTwo
        ,{
            headers:{
                'Authorization': 'dUxaRnA5NWJyWFlQYkpQNnEtemo6bzdvX01KLUNFbnRyS3hfdEgyLUE=',
                'Content-Type': 'application/json',
                'access_token': 'WXFubXJkYjljZHcyV3pCb04xZHk6dEFzNFBmd3g1dHJVZFZ6VFEtLXo6ZTFhV2ZnZ29WVVc0Y1hmVFF2blBMZzp2aXBpbi5rdW1hcjVAb3lvcm9vbXMuY29t',
                'x-authentication-token': 'e1aWfggoVUW4cXfTQvnPLg',
                'Cookie': 'request_method=PUT; request_method=POST; request_method=POST; request_method=POST'
            }
        })
        console.log(resTwo.data)

    } catch (error) {
        console.log(error)
    }
}

const type= "phone"
const typeValue="7258986668"
const userProfileId=161041302

updateTheProfile(userProfileId,type,typeValue);