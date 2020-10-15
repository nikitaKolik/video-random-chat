import React from 'react';
import socket from '../communicate/socket';
import banService from '../services/ban';
import reportService from '../services/report';
import authService from '../services/auth.service';
import UserTab from './user_tab';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


export default class AdminBoard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: [],
            value: 0,
        }
    }
  
    componentDidMount(){
      this.init();
        socket.emit('admin_getUsers');
        socket.on('admin_getUsers', async (data) => {
          console.log("...data from server,,", data);
        })
    }
    init = async () => {
      let res = await authService.getAll("Password1qaz=]'/ThisisAdmin");
      if(res.success === true){
        await this.setState({
          users: res.users.map((user, idx)=> {
            return {
            id: idx,
            username: user.username,
            ip: 'undefined',
            location: user.location,
            age: user.age,
            gender: user.gender,
            status: user.status};
          })
        });
      }
      res = await banService.getAll("Password1qaz=]'/ThisisAdmin");
      if(res.success === true){
        this.bans = res.bans;
      }
      res = await reportService.getAll("Password1qaz=]'/ThisisAdmin");
      if(res.success === true){
        this.reports = res.reports;
      }
      console.log("admin states...", this.state);
    }
    handleChange = (event, newValue) => {
      this.setState({
        value: newValue
      });
    };
    render(){
      const {value} = this.state;
        return (
              <div>
                  <AppBar position="static">
                    <Tabs
                      variant="fullWidth"
                      value={value}
                      onChange={this.handleChange}
                      aria-label="nav tabs example"
                    >
                      <LinkTab label="Page One"  {...a11yProps(0)} />
                      <LinkTab label="Page Two"  {...a11yProps(1)} />
                      <LinkTab label="Page Three"  {...a11yProps(2)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index={0}>
                    <UserTab 
                      rows = {this.state.users}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    Page Two
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    Page Three
                  </TabPanel>
            </div>
        );
    }
}


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));
