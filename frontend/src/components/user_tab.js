import React from 'react';
import MaterialTable from 'material-table';
import countryList from 'react-select-country-list';
const columns = [
  { field: 'username', title: 'Name' },
  { field: 'ip', title: 'IP' },
  { field: 'location', title: 'Location',  },
  {
    field: 'age',
    title: 'Age',
    type: 'numeric',
    
  },
  { field: 'gender', title: 'Gender', lookup: { 'Male': 'Male', 'Female': 'Female'}},
  { field: 'status', title: 'Status', lookup: {0:'On', 1 : 'Off', 2 : 'IP Banned', 3 : 'Account Banned'}},
];

export default class UserTab extends React.Component {
    constructor(props){
        super(props);
        this.locationOptions = null ;
        
    }
    getCountryOptions = () => {
        countryList().getData().forEach((item, idx) => {
            return {[item.label] : item.label};
        });
    }
    render(){
        return (
            <MaterialTable
            title="User Dashboard"
            columns={columns}
            data={this.props.rows}        
            options={{
              filtering: true
            }}
            editable={{
                onRowAdd: newUser =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      this.props.addUser(newUser);                  
                      resolve();
                    }, 1000)
                  }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                        const index = oldData.tableData.id;
                        this.props.updateUser(index, newData);
                        resolve();
                        }, 1000)
                    }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const index = oldData.tableData.id;
                      this.props.deleteUser(index);
                      resolve();
                    }, 1000)
                  }),
              }}
          />
        );
    }
}
