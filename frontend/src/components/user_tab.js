import React from 'react';
import socket from '../communicate/socket';
import banService from '../services/ban';
import reportService from '../services/report';
import authService from '../services/auth.service';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'username', headerName: 'Name' },
  { field: 'ip', headerName: 'IP' },
  { field: 'location', headerName: 'Location',  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    
  },
  { field: 'gender', headerName: 'Gender', },
  { field: 'status', headerName: 'Status',},
];

export default class UserTab extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={this.props.rows} columns={columns} pageSize={5} checkboxSelection />
          </div>
        );
    }
}