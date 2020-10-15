import React, { Component } from "react";
import FilterMenu from './filter_menu';
import ReportMenu from './report_menu.js';
import { connect } from "react-redux";
import { logout } from "../actions/auth";
const url = process.env.REACT_APP_SOCK;
class NabBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            filter: false,
            report: false,
        }
        this.isMt = false;
    }
    componentDidMount(){
        this.isMt = true;
    }
    logOut = async () => { 
        await this.props.endCall(true);
        await this.props.dispatch(logout(this.props.user));
        window.location.reload();    
    }
    skip = async() => {
        if(this.isMt) await this.props.skip();
    }
    toggle = (value) => {
        return async () => {
            if(this.isMt){
                await this.setState({
                    [value] : !this.state[value]
                 });
                if(value === 'filter' && this.state.filter === true) await this.setState({report: false});
                if(value === 'report' && this.state.report === true) await this.setState({filter: false});
                console.log('navbar toggeld..', value, this.state);
            }
        };
    }
    render() {
        return (
            <div className="navbar navbar-expand-sm bg-grey navbar-grey d-flex justify-content-between app-navbar align-items-center">
            <div>
                <i className="fas fa-times my-cursor"></i>
            </div>
            <div>
                <i className="fa fa-sync-alt" onClick={this.skip} style={{fontSize: "4vh"}}></i>
            </div>
            <div className="d-flex align-items-center">
                 <div className="app-dropdown">
                    <i className="fa fa-envelope-open-text my-cursor" onClick = {this.toggle('report')}>Report</i>
                    <div className="app-dropdown-content-center d-block">
                        {this.state.report  && <ReportMenu 
                            friendInfo = {this.props.friendInfo}
                            myId = {this.props.user.user._id}
                            toggle = {this.toggle('report')}
                        />}
                    </div>
                </div>
                <div className="app-dropdown">
                    <i className="fas fa-search my-cursor" onClick = {this.toggle('filter')}>Filter</i>
                    <div className="app-dropdown-content d-block">
                        {this.state.filter && <FilterMenu
                            toggle = {this.toggle('filter')}
                        />}
                    </div>
                </div>
                <div className="app-dropdown" style={{float: "right"}}>
                    <img src={this.props.user.user.avatar?`${url}${this.props.user.user.avatar}`:`${url}/public/avatar/myavatar.jpg`} alt="John Doe" className="rounded-circle shadow my-cursor app-user-avatar app-btn" />
                    <div className="app-dropdown-content">
                        <div onClick={this.props.toggleProfile} className="app-menu-item app-btn">Profile</div>
                        <hr style={{padding: '0px', margin: '0px', width:'100%'}} />
                        <div onClick={this.logOut} className="app-menu-item app-btn"><i className="fa fa-sign-out-alt">Log out</i></div>
                    </div>
                </div>
            </div>
        </div>

    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(NabBar);
