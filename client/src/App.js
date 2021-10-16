import React,{useState, useEffect} from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import './index.css'
import './App.css';

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;
const client = new W3CWebSocket('ws://127.0.0.1:8000');

const App = () =>{
  const [state, setState] = useState({
    userName: '',
    isLoggedIn: false,
    messages:[],
  });

  const onButtonClicked = (value) => {
    client.send(JSON.stringify({
      type:"message",
      msg:value,
      user: state.userName
    }));
    setState(prevState=>({...prevState, searchVal: ''}));
  };

  useEffect(()=>{
    client.onopen = () => {
      console.log('websocket client connected')
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply! ', dataFromServer);
      if(dataFromServer.type === 'message') {
        setState(prevState=>({...prevState, messages:[
          ...state.messages,
          {
            msg: dataFromServer.msg,
            user: dataFromServer.user
          }]
        }))
      }
    }
  },[state.messages]);

  return (
     <div className="main" id='wrapper'>
        {state.isLoggedIn ?
        <div>
          <div className="title">
            <Text id="main-heading" type="secondary" style={{ fontSize: '36px' }}>
              Websocket Chat: {state.userName}
              </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages">
            {state.messages && state.messages.map(message => 
              <Card key={message.msg} style={{ width: 300, margin: '16px 4px 0 4px', 
              alignSelf: state.userName === message.user ? 'flex-end' : 'flex-start' }} loading={false}>
                <Meta
                  avatar={
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                      {message.user[0].toUpperCase()}
                    </Avatar>
                  }
                  title={message.user+":"}
                  description={message.msg}
                />
              </Card> 
            )}
          </div>
          <div className="bottom">
            <Search
              placeholder="input message and send"
              enterButton="Send"
              value={state.searchVal}
              size="large"
              onChange={(e) => setState(prevState=>({...prevState, searchVal: e.target.value }))}
              onSearch={value => onButtonClicked(value)}
            />
          </div> 
        </div>
        :
        <div style={{ padding: '200px 40px' }}>
          <Search
            placeholder="Enter Username"
            enterButton="Login"
            size="large"
            onSearch={value => setState(prevState=>({...prevState, isLoggedIn: true, userName: value }))}
          />
        </div>
      }
      </div>
  );
}

export default App;
