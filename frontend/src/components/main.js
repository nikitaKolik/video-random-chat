import React, { Component } from 'react';
import _ from 'lodash';
import socket from '../communicate/socket';
import PeerConnection from '../communicate/PeerConnection';
import NabBar from './main_navbar';
import VideoPanel from './video_panel';
import MsgBox from './msg_box';
import ClientProfile from './clietn_profile';
import ViewImg from './view_img';
import Loading from './loading';
import { connect } from "react-redux";
import AuthService from '../services/auth.service';
import Profile from "./profile";
class Main extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.user);
    this.state = {
      clientId: '',
      localSrc: null,
      peerSrc: null,
      clientProfileFlag: false,
      friendId: '',
      viewImg: '',
      friendInfo: null,
      profile: false,
    };
    this.pc = {};
    this.config = null;
  }
  componentDidMount() {
    console.log("Main component mounted, current User: ", this.props.user);
    document.title = this.props.user.user.username;
    socket
      .on('init', async ({ id: clientId }) => {
        console.log('client id..', clientId);
        this.endCall(false);
        socket.emit('finding');
      })
      .on('request', async ({ from: friendId }) => {
        console.log('call request from...', friendId);

        this.getFriend(friendId);
        await this.setState({friendId});
        await this.startCall(false, friendId, { audio: true, video: true });
      })
      .on('call', async (data) => {
        try{
          if(data.sdp) {
            await this.pc.setRemoteDescription(data.sdp);
            if (data.sdp.type === 'offer') await this.pc.createAnswer();
          } else await this.pc.addIceCandidate(data.candidate);
        }catch(err){
          console.log("!!!Error::", err);
          await this.endCall(true);
          socket.emit('finding');
        }
      })
      .on('finding', async (friendId) => {
        console.log('finding from server ', friendId);
        if(friendId === 'null'){
          setTimeout(()=>socket.emit('finding'), 1500);
        }else{
          this.getFriend(friendId);
          await this.setState({friendId: friendId});
          await this.startCall(true, friendId, { audio: true, video: true });
        }
      })
      .on('end', async (friendId) => {
        console.log('call end message from...');
        if(this.state.friendId === friendId || friendId === "fromServerSocket"){
           await this.endCall(false);
           socket.emit('finding');
        }
      })
      .on('reset', async () => {
        await this.endCall(true);
        socket.emit('init', this.props.user.user._id);
      })
      .emit('init', this.props.user.user._id);

  }
  componentWillUnmount(){
    this.endCall(true);
    socket.disconnect();
    console.log("main component will unmount now...", this.pc);
  }
  getFriend = async (friendId) => {
    let response = await AuthService.getFriendInfo(friendId, this.props.user.token);
    console.log("Get friend info from server", response);
    if(response.success === true){
      this.setState({
        friendInfo: response.user
      });
    }else{
      console.log('Getting friend info from server failed');
      this.setState({
        friendInfo: null
      });
      this.endCall(true);
    }
  }
  skip = async () => {
    console.log("skip..current friendId", this.state.friend);
    await this.endCall(true);
    socket.emit('finding');
  }
  startCall = async (isCaller, friendID, config) => {
    console.log('start call...', isCaller, friendID, config);

    this.config = config;
    this.pc = new PeerConnection(friendID)
      .on('localStream', async (src) => {
        const newState = { localSrc: src };
        await this.setState(newState);
      })
      .on('peerStream', async (src) => await this.setState({ peerSrc: src }))
      .start(isCaller, config);
  }

  endCall = async (isStarter) => {
    console.log('end call to...', this.state.friendId, isStarter);
    if (_.isFunction(this.pc.stop)) {
      await this.pc.stop(isStarter);
    }
    this.pc = {};
    this.config = null;
    await this.setState({
      localSrc: null,
      peerSrc: null,
      clientProfileFlag: false,
      friendId: '',
      viewImg: '',
      friendInfo: null,
    });
  }
  toggleFriendFlag = (value) => {
    return async () => {
      await this.setState({clientProfileFlag: !this.state.clientProfileFlag});
    };
  }
  viewImage = (src) => {
    return async () => {
      await this.setState({viewImg: src});
    };
  }
  toggleProfile = async () => {
    await this.setState({
      profile: !this.state.profile
    });
    if(!this.state.profile) socket.emit('finding');
    else this.endCall(true);
  }
  render() {
    const { viewImg, localSrc, peerSrc, clientProfileFlag, friendId, friendInfo } = this.state;
    return (
      <div> {!this.state.profile && (
  <div className="container-fluid shadow-lg app-main-div">
    <NabBar 
      history={this.props.history}
      skip = {this.skip}
      endCall={this.endCall}
      toggleProfile = {this.toggleProfile}
      friendInfo = {this.state.friendInfo}
    />
    <div className="d-flex app-board">
      {_.isEmpty(this.config) && !friendInfo &&
        (<Loading />)
      }
      {!_.isEmpty(this.config) && friendInfo && (
            <VideoPanel
              localSrc={localSrc}
              peerSrc={peerSrc}
              config={this.config}
              mediaDevice={this.pc.mediaDevice}
            />
          ) }
        {!_.isEmpty(this.config) && friendInfo &&  
          <MsgBox 
              toggle={this.toggleFriendFlag}
              viewImage={this.viewImage}
              friendId={this.state.friendId}
              avatar={this.state.friendInfo.avatar}
          />}
        {!_.isEmpty(this.config) && friendInfo && clientProfileFlag && 
          <ClientProfile 
              clientInfo = {this.state.friendInfo}
              toggle={this.toggleFriendFlag}
              info={this.state.friendInfo}
          />}
     </div>
        {(viewImg !== '') && <ViewImg
            src={viewImg}
            toggle={this.viewImage}
        />}
  </div>)}
  {this.state.profile && <Profile toggleProfile={this.toggleProfile}/>}
  </div>

    );
  }
}


function mapStateToProps(state) {
  const { user } = state.auth;
  const { isLoggedIn } = state.auth;
  return {
    user,
    isLoggedIn,
  };
}

export default connect(mapStateToProps)(Main);
