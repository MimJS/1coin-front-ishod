import React, {useState} from 'react'
import {Avatar, SimpleCell} from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import {Icon28CoinsOutline} from '@vkontakte/icons'
import * as util from './addon/func.js'

const User = (p) => {
    const [d] = useState(JSON.parse(p.d.db.history))
    let id = 0
    if(d.from){
        id = d.from
    } else {
        id = d.to
    }
    const [data,setdata] = useState({})
    const [err,seterr] = useState(0)
    bridge.send("VKWebAppCallAPIMethod", {"method": "users.get", "request_id": "1coin", "params": {"user_ids": `id` + id , "fields":"photo_200", "v":"5.131", "access_token":p.d.token}}).then((r) => {
                            setdata(r.response[0])
                            seterr(0)
                        }).catch((e) => {
                            seterr(1)
                        })
    return(
        <div>
                            <>           
                            {Object.keys(data).length > 0 ?
                                <SimpleCell 
                            className={d.from_id ? `plus` : `minus`}
                            hasHover={false}
                            hasActive={false}
                            before={
                            <Avatar 
                            size={42} 
                            src={data.photo_200} />} 
                            description={
                            <>
                            <span>{d.from_id ? `+` : `-`} {util.nf(d.amount)}</span>
                            <Icon28CoinsOutline width={16} height={16} />       
                            </>
                            }>{data.first_name + ` ` + data.last_name}</SimpleCell>
                                :
                            <span>Загрузка...</span>}
                            {err == 1 &&
                            <span>Произошла ошибка...</span>
                            }
                            </>
        </div>
    )
}

export default User