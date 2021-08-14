import React, { useEffect, useState } from 'react';
import { ConfigProvider, View, Root} from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge'
import '@vkontakte/vkui/dist/vkui.css';
import Main from './panels/main.js'
import './panels/css/global.css'

const v = 1;

const App = () => {

     
        const [view, setview] = useState(`main`)

        bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#56BE7E"});

        return (
          
            <ConfigProvider isWebView={false} platform='ios' scheme='space_gray'>
            <Root activeView={view}>
                    <Main id='main' v={v} />                
                </Root>
                </ConfigProvider>
              
        );
    }

export default App;

