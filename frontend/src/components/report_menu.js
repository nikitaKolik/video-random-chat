
import React, { Component } from "react";
import Input from '@material-ui/core/Input';
import socket from '../communicate/socket';
import ReportService from '../services/report';

class ReportMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: this.props.friendInfo ? this.props.friendInfo.username : '',
            description: '',
            msg: null,
        }
        this.isMt = false;
    }
    componentDidMount() {
      this.isMt = true;
    }
    componentWillUnmount(){
      this.isMt = false;
    }
    handleUsername = (e) => {
        if(this.isMt && !this.props.friendInfo) this.setState({username: e.currentTarget.value});
    }
    handleDescription = (e) => {
      if(this.isMt) this.setState({description: e.currentTarget.value});
    }
    submitReport = async (e) => {
        e.preventDefault();
        if(this.isMt) await this.setState({msg: null});
        let result = await ReportService.sendReport ({ to: this.state.username, description: this.state.description, from: this.props.myId});
        console.log('report result', result);
        if(result.success === true) {
          socket.emit('report');
          if(this.isMt) this.setState({
            username: this.props.friendInfo ? this.props.friendInfo.username : '',
            description: '',
            msg: null,
          });
          await this.props.toggle();
        }else{
          if(this.isMt) this.setState({ msg: result.message});
        }
    }
    render() {
      return (
        <div className="hide-overflow" style={{overflowY: 'auto', padding: '15px', width: '250px'}}>
          <div className='d-flex align-items-center justify-content-between' style={{borderBottom: '2px solid grey'}}>
           <div className="d-flex"><i className="fa fa-envelope-open-text" style={{paddingRight: '5px', color: 'black'}}></i><h4 >Report</h4></div>
           <i className="fas fa-times my-cursor" onClick={this.props.toggle}></i>
          </div>
          <form style={{padding: '1vw'}}>
            <div className="d-flex pt-3 form-group">
                 <Input placeholder="Username" 
                    inputProps={{ 'aria-label': 'description' }} 
                    value = { this.props.friendInfo ? this.props.friendInfo.username : this.state.username}
                    onChange = {this.handleUsername}
                    required
                />
            </div>
            <div className="pt-3 form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>description: </div>
                  <textarea
                    row="20"
                    value={this.state.description}
                    onChange={this.handleDescription}
                    style={{ border:'none', borderBottom: "solid 2px #eee", width: "100%", backgroundColor: '#fafafa', height: '20vh'}}
                    required
                 />
                </div>
            <div className="form-group pt-3">
                <button className="btn btn-primary btn-block" type="submit" onClick={this.submitReport} style={{backgroundColor: 'slateblue', border: "none"}}>Report</button>
            </div>
            {this.state.msg && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.msg}
                </div>
              </div>
            )}
          </form>
        </div>
      );  
    }
}

export default ReportMenu;
