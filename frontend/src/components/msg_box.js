import React, { Component } from "react";
import Msg from './msg';
import socket from '../communicate/socket';
import MsgInput from './msg_input';

class MsgBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            chats:[],
            friendTyping: false,
        };
        this.mtFlag = false;
    }
    componentDidMount(){
        this.mtFlag = true;
        this.scrollDown();
        if(this.props.friendId){
            this.resetChat();
        }
    }
    componentWillUnmount(){
        this.mtFlag = false;
    }
	componentDidUpdate(prevProps, prevState) {
		this.scrollDown();
    }
    scrollDown = () => {
		const { container } = this.refs
		container.scrollTop = container.scrollHeight
	}
    resetChat = () => {
        const { chats } = this.state;
		socket.on('msg_typing', async (data) =>{
            if(data.from === this.props.friendId){
                if(this.mtFlag) this.setState({friendTyping: data.status});
            }
        });
		socket.on('new_msg', (data) => {
            if(data.from === this.props.friendId){
                data.msg.time = this.getTime(new Date(Date.now()));
                if(this.mtFlag) this.setState({chats: [...this.state.chats, data.msg]});
                console.log('after receive msg', chats);
            }
        })
    }
    
    getTime = (date)=>{
        return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
    }
    
    renderMsg = () => {
        return this.state.chats.map((msg, id) =>{
            return (<Msg
                key={id}
                msg = {msg}
                toggle={this.props.toggle}
                viewImage = {this.props.viewImage}
                avatar={this.props.avatar}
                />);
            })
    };
    getMsg = (msg) => {
        if(this.mtFlag) this.setState({
            chats: [...this.state.chats, {...msg, time: this.getTime(new Date(Date.now()))}]
        });
    }
    render() {
        return (
        <div className="d-flex flex-fill flex-column">
            <div ref='container' className="hide-overflow app-msg-box">
                 {this.renderMsg()}             
            </div>
            <MsgInput
                getMsg={this.getMsg}
                friendId={this.props.friendId}
                avatar={this.props.avatar}
                friendTyping={this.state.friendTyping}
            />
        </div>
        );
  }
}

export default MsgBox;
