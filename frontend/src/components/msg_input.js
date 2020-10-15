import React, { Component } from "react";
import socket from '../communicate/socket';
import UploadService from '../services/upload.service';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

const url = process.env.REACT_APP_SOCK;

class MsgInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            isTyping: false,
            text: '',
            file: null,
            fileSrc: null,
            emojiBox: 'hidden',
        };
        this.hiddenFileInput = React.createRef();
    }
    componentDidMount(){
    }
    onEmojiClick = (emoji, event) => {
        console.log("Emoji", emoji);
        this.setState({
            text: this.state.text + emoji.native,
        });
    };   
    sendTyping = ()=>{
        console.log('sendTyping...')
		this.lastUpdateTime = Date.now();
		if(!this.state.isTyping){
			this.setState({isTyping:true});
			socket.emit('msg_typing', {to: this.props.friendId, status: true});
			this.startCheckingTyping();
		}
	}
	startCheckingTyping = ()=>{
		console.log("Typing");
		this.typingInterval = setInterval(()=>{
			if((Date.now() - this.lastUpdateTime) > 300){
				this.setState({isTyping:false})
				this.stopCheckingTyping()
			}
		}, 300)
	}
	
	stopCheckingTyping = ()=>{
		console.log("Stop Typing");
		if(this.typingInterval){
			clearInterval(this.typingInterval)
			socket.emit('msg_typing', {to: this.props.friendId, status: false});
		}
	}
    
    sendMsg = async (e) => {
        e.preventDefault();
        console.log("send button cliked...");
        const {text, file} = this.state;
        const {friendId} = this.props;
        if(file != null){
            let fileSrc = await UploadService.uploadImage(file);
            if(fileSrc){
                socket.emit('new_msg', {to: friendId, msg: {
                    type: 'left_file_msg',
                    src: fileSrc,
                }});
                this.props.getMsg({
                    type: 'right_file_msg',
                    src: fileSrc,
                });
            }
        }
        if(text !== ''){ 
            socket.emit('new_msg', {to: friendId, msg: {
                type: 'left_msg',
                text,
             }});
             this.props.getMsg({
                type: 'right_msg',
                text,
            });
        }
        this.setState({
            text: '',
            file: null,
            fileSrc: null,
            emojiBox: 'hidden',
        });
    }
    handleText = event => {
        this.setState({text: event.currentTarget.value});
    }
    handleClick = async event => {
      this.hiddenFileInput.current.click();
    };
    handleChange = async event => {
      const fileUploaded = event.target.files[0];
      if(fileUploaded){
          console.log(fileUploaded);
          let ext = fileUploaded.name.split('.').pop().toLowerCase();
          if(ext !== 'jpg' && ext !== 'png' && ext !== 'gif' && ext !== 'jpeg' && ext !== 'bmp') return;
          await this.readURL(fileUploaded);
          await this.setState({file: fileUploaded});
      }
    };
    readURL = async (file) => {
        if (file) {
            var reader = new FileReader();
    
            reader.onload = async (e) => {
              await this.setState({fileSrc: e.target.result});
            };
    
            reader.readAsDataURL(file);
        }
    }
    handleCloseFileupload = () => {
        this.setState({file: null, fileSrc: null});
    }
    handleEmojiBox = () => {
        this.setState({emojiBox: this.state.emojiBox === 'hidden'?'visible':'hidden'});
    }
    render() {
        return (
            <div className="position-relative">
                <div className="app-emoji-picker" style={{visibility: this.state.emojiBox}}>
                    <Picker onSelect={this.onEmojiClick} />
                </div>  
                 {this.props.friendTyping && 
                    <div className="dotsContainer shadow app-typing">
                        <img src={this.props.avatar?`${url}${this.props.avatar}`:`${url}/public/avatar/unknown.png`} alt="" className="rounded-circle my-cursor app-msg-client-avatar"/>  
                        <span id="dot1"></span>
                        <span id="dot2"></span>
                        <span id="dot3"></span>
                    </div>}
                <form onSubmit={ this.sendMsg } className="chat-box-tray h-7vh position-relative">
                    {this.state.fileSrc && <div className='position-absolute app-file-upload'>
                        <div className="position-relative">
                            <img src={this.state.fileSrc} alt='' className="app-file-upload-img"/>
                            <div className="app-topright"><i className="fas fa-times my-cursor app-cross" onClick={this.handleCloseFileupload}></i></div>
                        </div>
                    </div>}
                    <div className="d-flex  app-msg-input-wrapper">
                        <i className="material-icons my-cursor" style={{fontSize: "5vh"}} onClick={this.handleEmojiBox}>sentiment_very_satisfied</i>
                        <input type="text" className="app-msg-input" 
                            placeholder=" Type your message here... "
                            value = {this.state.text}
                            onKeyUp = { e => { if(e.keyCode !== 13) this.sendTyping() } }
                            onChange={this.handleText}
                            style={{fontSize: "14px"}}
                        />
                    </div>
                    <div >
                        <i className="fa fa-image my-cursor " style={{fontSize: "5vh"}} onClick={this.handleClick}></i>
                        <input type="file"
                            ref={this.hiddenFileInput}
                            onChange={this.handleChange}
                            style={{display:'none'}} 
                        /> 
                    </div>
                    <div >
                        <i className="fa fa-paper-plane my-cursor" style={{fontSize: "5vh"}}
                            onClick={this.sendMsg}
                        ></i>
                    </div>
                </form>
            </div>
        );
  }
}

export default MsgInput;
