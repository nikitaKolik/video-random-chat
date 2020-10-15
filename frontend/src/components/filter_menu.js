
import React, { Component } from "react";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import countryList from 'react-select-country-list';
import Slider from '@material-ui/core/Slider';
import socket from '../communicate/socket';

class FilterMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
          ageMin: 1,
          ageMax: 100,
          location: '',
          male:true,
          female:true,
        }
        this.locationOptions = countryList().getData().map((item, idx) => {
          return <option key={idx}>{item.label}</option>;
        });
    }
    handleLocation = (e) => {
      this.setState({ location: e.currentTarget.value});
    }
    handleAge = (event, value) => {
      this.setState({
        ageMin: value[0],
        ageMax: value[1]
      });
    };
    handleGender = (event) => {
      let target = event.currentTarget;
      this.setState({
        [target.value]: target.checked
      });
    }
    submitFilter = async () => {
      const {ageMin, ageMax, male, female, location} = this.state;
      let gender = 'all';
      if(male && !female) gender = 'Male';
      else if(!male && female) gender = 'Female';
      socket.emit('filter', {ageMin, ageMax, location, gender}); 
      await this.props.toggle();
    }
    render() {
      const {ageMin, ageMax} = this.state;
      return (
        <div className="hide-overflow" style={{ overflowY: 'auto', padding: '15px'}}>
          <div className='d-flex align-items-center justify-content-between' style={{borderBottom: '2px solid grey'}}>
            <div className="d-flex"><i className="fa fa-search" style={{paddingRight: '5px', color: 'black'}}></i><h4 >Filter</h4></div>
            <i className="fas fa-times my-cursor" onClick={this.props.toggle}></i>
          </div>
          <div style={{padding: '1vw'}}>
          <div className="d-flex pt-3 form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>Location: </div>
                  <select 
                      style={{ border:'none', borderBottom: "solid 2px #eee", maxWidth: "178px", backgroundColor: '#fafafa'}}
                      value={this.state.location}
                      onChange={this.handleLocation}
                      required
                    >
                      {
                        this.locationOptions
                      }
                    </select>
                </div>
            <div className="d-flex pt-3 form-group">
                    <div style={{color: '#ccc', paddingRight: '6px'}}>Age Range: </div>
                    <Slider
                      min={13}
                      max={99}
                      value={[ageMin, ageMax]}
                      onChange={this.handleAge}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                    />
            </div>
            <div className="d-flex pt-3 form-group align-items-center">
                    <div style={{color: '#ccc', paddingRight: '6px'}}>Gender: </div>
                    <FormControlLabel
                      value="male"
                      control={<Checkbox color="primary" />}
                      label="Male"
                      labelPlacement="end"
                      checked={this.state.male}
                      onChange={this.handleGender}
                    />
                    <FormControlLabel
                      value="female"
                      control={<Checkbox color="primary" />}
                      label="Female"
                      labelPlacement="end"
                      checked={this.state.female}
                      onChange={this.handleGender}
                    />
            </div>
          </div>
          <div className="form-group pt-3">
            <button className="btn btn-primary btn-block" onClick={this.submitFilter} style={{backgroundColor: 'slateblue', border: "none"}}>Apply</button>
          </div>
        </div>
      );  
    }
}

export default FilterMenu;
