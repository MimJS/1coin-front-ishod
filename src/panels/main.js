import React, { useEffect, useState } from 'react'
import { Panel, Div, Gradient, ModalCard, Title, PullToRefresh, Alert, Avatar, Snackbar, Placeholder, Button, SimpleCell, View, ScreenSpinner, ModalRoot, ModalPage, ModalPageHeader, Search, Input } from '@vkontakte/vkui'
import { Icon28CoinsOutline, Icon28MoneyHistoryBackwardOutline,Icon20CheckCircleOn, Icon20MoneyTransferOutline, Icon28CancelOutline, Icon56ChainOutline, Icon56ErrorOutline, Icon20DonateCircleFillYellow } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge'
import * as util from './addon/func.js'
import * as sf from './addon/shifr.js'
import './css/main.css'
import axios from 'axios'
import useDebounce from './addon/debounce.js'
import $ from 'jquery'

const Main = p => {

    const [data, setdata] = useState({
        vk: {

        },
        transfer: [

        ],
        db: {
        },
        token: `654f3207654f3207654f3207a56537d6cc6654f654f3207045e5674dfd832d63b552b74`,
        signvalid: false,
        isDon: 0 
    })

    const [isf, setisf] = useState(false)

    const [pop, setpop] = useState(<ScreenSpinner />)
    const [modalname, setmodal] = useState(null)

    const [vkurl, setvkurl] = useState(``)

    const [res, setres] = useState({})
    const [err,seterr] = useState(0)

    const [trsum, settrsum] = useState(``)

    const isReady = useDebounce(vkurl, 500)

    const [st,setst] = useState(null)

    $( ".Icon--money_history_backward_outline_28" ).click(async function() {
        if($( ".Icon--money_history_backward_outline_28" ).hasClass("rotate-Icon") || Object.keys(data.db).length == 0){
            return
        }
        $( ".Icon--money_history_backward_outline_28").addClass( "rotate-Icon" )
        await getusr(2)
      });

    useEffect(() => {

        if(isReady){
            let i = vkurl
            if(i.startsWith(`https://vk.com/`) && i.split(`https://vk.com/`)[1].length > 0){
                        // here search
                        bridge.send("VKWebAppCallAPIMethod", {"method": "users.get", "request_id": "1coin", "params": {"user_ids": i.split(`https://vk.com/`)[1], "fields":"photo_200", "v":"5.131", "access_token":data.token}}).then((r) => {
                            setres(r.response)
                            seterr(0)
                            settrsum(``)
                        }).catch((e) => {
                            setres({})
                            seterr(1)
                            settrsum(``)
                        })
                    } else if(i.startsWith(`vk.com/`) && i.split(`vk.com/`)[1].length > 0){
                        // here search
                        bridge.send("VKWebAppCallAPIMethod", {"method": "users.get", "request_id": "1coin", "params": {"user_ids": i.split(`vk.com/`)[1], "fields":"photo_200", "v":"5.131", "access_token":data.token}}).then((r) => {
                            setres(r.response)
                            seterr(0)
                            settrsum(``)
                        }).catch((e) => {
                            setres({})
                            seterr(1)
                            settrsum(``)
                        })
                    } else if(i.startsWith(`@`) && i.split(`@`)[1].length > 0){
                        // here search
                        bridge.send("VKWebAppCallAPIMethod", {"method": "users.get", "request_id": "1coin", "params": {"user_ids": i.split(`@`)[1], "fields":"photo_200", "v":"5.131", "access_token":data.token}}).then((r) => {
                            setres(r.response)
                            seterr(0)
                            settrsum(``)
                        }).catch((e) => {
                            setres({})
                            seterr(1)
                            settrsum(``)
                        })
                    }
        } else {
            setres({})
        }
    }, [isReady])

    useEffect(() => {

        if (Object.keys(data.vk).length == 0) {

            getvkd()

        }

        if (Object.keys(data.vk).length > 0 && Object.keys(data.db).length == 0) {
            // here request
            getusr(1)
        }

        if(Object.keys(data.db).length > 0){
            if(Object.keys(data.db.history).length > 0){
                gete()
            }
        }

    }, [data])

    useEffect(() => {
        // okay, interval and ?
        if(Object.keys(data.db).length > 0){
            const interval = setInterval(() => {
                getusr(2)
           }, 30000)
       
           return () => {
               clearInterval(interval);
           }
        }
    }, [data])

    const getvkd = () => {
        // Nothing intersting
        setpop(<ScreenSpinner/>)
        setmodal(null)
        bridge.send("VKWebAppGetUserInfo").then((r) => {
            setdata({ ...data, vk: r })
            bridge.send("VKWebAppCallAPIMethod", {"method": "donut.isDon", "request_id": "1coin", "params": {"owner_id": "-206462740", "v":"5.131", "access_token":data.token}}).then((r) => {
                setdata({...data, isDon: r.response})
                return
            })
        }).catch((e) => {
            //open error modal
            setpop(null)
            setmodal(`errorvk`)
            return
        })
    }


    const getusr = (d) => {
        // GO AWAY FROM HERE
        if(!$( ".Icon--money_history_backward_outline_28").hasClass( "rotate-Icon" ) && d == 1){
            setpop(<ScreenSpinner/>)
        }
        if(d == 1){
            setpop(<ScreenSpinner/>)
            setmodal(null)
        }
        setisf(true)
        if(data.signvalid == false){
            axios.get(`https://a0e4fcd88b57.ngrok.io/api/checkSign${window.location.search}`, {}).then((r) => {
            if (r.data.sign_valid) {
                setdata({...data, signvalid:true})
            } else {
                if(d == 1){
                    setpop(null)
                }
                
                    setmodal(`error`)
                    return
            }
        }).catch((e) => {
            setpop(null)
                    setmodal(`error`)
        })
        } else {
                 axios.get(`https://a0e4fcd88b57.ngrok.io/api/getUser${window.location.search}&search_user_id=${data.vk.id}`, {}).then((r) => {
                    setisf(false)
                    if(r.data.error){
                        axios.get(`https://a0e4fcd88b57.ngrok.io/api/getErrors?error_id=${r.data.error_code}`, {}).then((r) => {
                                        
                            window.localStorage[`error`] = r.data.response
                            if(d == 1){
                                setpop(null)
                            }
                            setmodal(`errorcode`)
                            return
                        }).catch((e) => {
                                        

                            setpop(null)
                            setmodal(`error`)
                            return
                        })
                    } else {
                        if($( ".Icon--money_history_backward_outline_28").hasClass( "rotate-Icon" )){
                            $( ".Icon--money_history_backward_outline_28").removeClass( "rotate-Icon" )
                        }
                        
                        if(d == 1){
                            setpop(null)
                        }
                        setdata({...data, db:r.data.response })
                        return
                    }
                    
                }).catch((e) => {
                                

                    setpop(null)
                    setmodal(`error`)
                    return
                })

        }
    }


    const gete = () => {
        if(Object.keys(data.db.history).length == 0){
            return
        }
        bridge.send("VKWebAppCallAPIMethod", {"method": "users.get", "request_id": "1coin", "params": {"user_ids": `id` + data.db.history.id , "fields":"photo_200", "v":"5.131", "access_token":data.token}}).then((r) => {
setst( <SimpleCell 
className={data.db.history.type == `receive` ? `plus` : `minus`}
hasHover={false}
hasActive={false}
before={
<Avatar 
size={42} 
src={r.response[0].photo_200} />} 
description={
<>
<span>{data.db.history.type == `receive` ? `+` : `-`} {util.nf(data.db.history.amount)}</span>
<Icon28CoinsOutline width={16} height={16} />       
</>
}>{r.response[0].first_name + ` ` + r.response[0].last_name}</SimpleCell>
)
        
        }).catch((e) => {

            setmodal(`errorvk`)
            return
        })
    }


    const modals = (
        <ModalRoot activeModal={modalname}>
            <ModalPage onClose={() => setmodal(null) && seterr(0)} id={`transfer`} settlingHeight={100} dynamicContentHeight header={
                <ModalPageHeader left={<Icon28CancelOutline style={{ marginLeft: 5 }} onClick={() => setmodal(null) && seterr(0)} />}>Перевод</ModalPageHeader>
            }>

                <Search value={vkurl} disabled={data.token.length > 0 ? false : true} placeholder={data.token.length > 0 ? `Введите ссылку` : `Получите токен`} onChange={(e) => {
                    setvkurl(e.currentTarget.value)
                    let i = e.currentTarget.value
                    if(i.length == 0){
                        setres({})
                    }
                }} />

                {(vkurl.length == 0 && data.token.length > 0 && Object.keys(res).length == 0) &&
                    <Placeholder icon={<Icon56ChainOutline />}>Введите ссылку на пользователя<br/>Например https://vk.com/niki_tt<br/>или @mikhailmat</Placeholder>
                }

                {(Object.keys(res).length > 0 && vkurl.length > 0 ) &&
                <Placeholder className='tr_info' icon={<Avatar size={56} src={res[0].photo_200} />}>
                    <span>{res[0].first_name + ` ` + res[0].last_name}</span>
                    <Input style={{ marginTop:20 }} value={trsum} placeholder='Введите сумму' type='number' onChange={(e) => {
                        let i = e.currentTarget.value
                        if(i > 50 && data.isDon == 0 && 50 <= data.db.balance){
                            return settrsum(50)
                        }
                        if(i > data.db.balance){
                            return settrsum(data.db.balance)
                        }
                        if(i < 0){
                            return settrsum(``)
                        } else if( i.indexOf(`.`) != -1 ){
                            return settrsum(i.split(`.`)[0])
                        } else {
                            return settrsum(i)
                        }
                    }} />
                    <Button onClick={async() => {

                        let e = await sf.e({
                            'sum':Number(trsum),
                            'from_id':Number(data.vk.id),
                            'to_id':Number(res[0].id)
                        })

                        setpop(<ScreenSpinner/>)
                        
                        axios.post(`https://a0e4fcd88b57.ngrok.io/api/sendTransfer`, {
                            body:{
                                'key':e,
                                'key_length':e.length
                            }
                        }).then((r) => {
                            if(r.data.error){
                                axios.get(`https://a0e4fcd88b57.ngrok.io/api/getErrors?error_id=${r.data.error_code}`, {}).then((r) => {
                                        
                                    setpop( <Alert
                                        actions={[{
                                          title: 'Закрыть',
                                          autoclose: true,
                                          mode: 'cancel'
                                        }]}
                                        actionsLayout="horizontal"
                                        onClose={() => setpop(null)}
                                        header="Произошла ошибка"
                                        text={r.data.response}
                                      />)
                                    return
                        }).catch((e) => {
                                    
                            setmodal(`error`)
                            return
                        })
                            } else {
                                setdata({...data, db:{balance:r.data.response.balance, history:r.data.response.history} })
                                setpop( <Snackbar
                                    onClose={() => setpop(null)}
                                    after={<Icon20CheckCircleOn width={24} height={24} fill='var(--accent)' />}
                                  >
                                    Монеты отправлены
                                  </Snackbar>)
                            setmodal(null)
                            settrsum(``)
                            setres({})
                            setvkurl(``)
                            return
                            }
                        }).catch((e) => {
                            setmodal(`error`)
                            return
                        })

                }} disabled={(trsum >= 1 && trsum <= data.db.balance) ? false : true} size='l' before={<Icon20MoneyTransferOutline/>} stretched style={{ marginTop:15, marginBottom:10, color:'white', background:'var(--accent)' }}>Перевести</Button>
                                        <span style={{ fontSize:14 }} >Мин. 1 Макс. 50</span>
                    </Placeholder>
                }

                {( err == 1 && vkurl.length > 0 ) &&
                <Placeholder icon={<Icon56ErrorOutline fill='#EE5E55' />}>Пользователь не найден</Placeholder>
                }

            </ModalPage>
            <ModalCard onClose={() => bridge.send("VKWebAppClose", {"status": "success", "payload": {} })} id='error' icon={<Icon56ErrorOutline fill='#EE5E55' />} actions={<Div style={{display:'flex', width:'100%' }}><Button onClick={() => getusr(1)} size='m' stretched>Переподключиться</Button><Button onClick={() => bridge.send("VKWebAppClose", {"status": "success", "payload": {} })} stretched  size='m'>Выйти</Button></Div>}>
            Разорвано соединение с сервером
            </ModalCard>
            <ModalCard onClose={() => bridge.send("VKWebAppClose", {"status": "success", "payload": {} })} id='errorvk' icon={<Icon56ErrorOutline fill='#EE5E55' />} actions={<Div style={{display:'flex', width:'100%' }}><Button onClick={() => getusr(1)} size='m' stretched>Переподключиться</Button><Button onClick={() => bridge.send("VKWebAppClose", {"status": "success", "payload": {} })} stretched  size='m'>Выйти</Button></Div>}>
            Произошла ошибка на серверах VK
            </ModalCard>
            <ModalCard onClose={() => bridge.send("VKWebAppClose", {"status": "success", "payload": {} })} id='errorcode' icon={<Icon56ErrorOutline fill='#EE5E55' />} actions={<Div style={{display:'flex', width:'100%' }}><Button onClick={() => getusr(1)} size='m' stretched>Переподключиться</Button><Button onClick={() => bridge.send("VKWebAppClose", {"status": "success", "payload": {} })} stretched  size='m'>Выйти</Button></Div>}>
            {(window.localStorage[`error`] && window.localStorage[`error`] !== undefined) ? window.localStorage[`error`] : `Произошла неизвестная ошибка` }
            </ModalCard>
        </ModalRoot>
    )

    return (

        <View id='main' activePanel={`main`} popout={pop} modal={modals}>
            <Panel id={p.id}>
                <PullToRefresh onRefresh={() => getusr(2)} isFetching={isf}>
                <Gradient style={{
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 32,

                }}>
                    <Avatar size={96} src={Object.keys(data.vk).length > 0 ? data.vk.photo_200 : ``} />
                    <Title style={{ marginBottom: 8, marginTop: Object.keys(data.db).length > 0 ? 20 : 10 }} level="2" weight="medium">{Object.keys(data.vk).length > 0 ? <span style={{ display: 'flex', alignItems: 'center' }}>{data.vk.first_name + ` ` + data.vk.last_name}{data.isDon == 1 && <Icon20DonateCircleFillYellow style={{ marginLeft: 5 }} width={14} height={14} />}</span> : ``}</Title>
                    <div className='coin_count'>
                        {Object.keys(data.db).length > 0 ? <><span>{util.nf(data.db.balance)} </span><Icon28CoinsOutline fill='var(--accent)' /></> : <span style={{ color: 'var(--gray)' }}>Загрузка...</span>}
                    </div>
                    {Object.keys(data.db).length > 0 && <Button onClick={() => setmodal(`transfer`)} size="m" mode="secondary" before={<Icon20MoneyTransferOutline fill='var(--accent)' />}>Перевести монеты</Button>}
                </Gradient>
                <Div className='history'>
                    <Title level='2' weight='medium'><Icon28MoneyHistoryBackwardOutline fill='var(--accent)' /><span>Последний перевод</span></Title>
                    <div className='list'>
                        {Object.keys(data.db).length > 0 ?
                            <>
                               {Object.keys(data.db.history).length > 0 ?
                               <>
                                {
                                        st
                                }
                                <span className='down'>Скоро тут будет реклама не ссыте :3</span>
                                </>
                               :
                               <span className='down' style={{ marginTop:20 }}>Переводы не найдены</span>
                               }
                            </>
                            :
                            <p style={{ color: 'var(--gray)', fontSize: 16 }}>Загрузка...</p>
                        }
                    </div>
                </Div>
                </PullToRefresh>
            </Panel>
        </View>
    )
}

export default Main