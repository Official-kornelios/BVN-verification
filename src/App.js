import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from "axios";

import './App.css';

const bvnRegex = RegExp(/^[0-9]*$/);

const formValid = formErrors => {
  let valid = true;

  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid=false)
  });
  
  return valid
};


class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      verNum: null,
      status: null,
      regDate: null,
      firstName: null,
      branch: null,
      formErrors: {
        verNum: "",
      }
    };

  }


  handleSubmit = e =>{
    
    e.preventDefault();

    if (formValid(this.state.formErrors)){
      console.log(`
        --SUBMITTING--
        Verification no: ${this.state.verNum}
      `);
    } else {
      console.error('FORM INVALID - DISPLAY ERROR MESSAGE');
    }

    
    axios.get(`https://ravesandboxapi.flutterwave.com/v2/kyc/bvn/${this.state.verNum}?seckey=FLWSECK-d2348ad39924318710db5f8d2354a96b-X`)
    .then((res) => {
      const status = res.data.status;
      const regDate = res.data.data.registration_date;
      const firstName = res.data.data.first_name;
      const branch = res.data.data.enrollment_branch;
      this.setState({ status : status });
      this.setState({ regDate : regDate });
      this.setState({ firstName : firstName });
      this.setState({ branch : branch });
    })

  };

  handleChange = e =>{
    
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = this.state.formErrors;

    switch(name) {
      case 'verNum':
        formErrors.verNum = 
          bvnRegex.test(value) && value.length > 0 
          ? ""
          :"please enter digits only";
        break;
      default:
        break;
    }

    this.setState({formErrors, [name]: value }, () => console.log(this.state));

  };

  render() {
    
    const { formErrors } = this.state;
    const { regDate, firstName, branch, status} = this.state;
    

    return (
      <div className = "wrapper">
        
        <div className = "form-wrapper">

        <img src = "../Design/Assets/logo.png" alt = "flutterwave logo" height = "100px" width = "100px" />
          <h5> BVN validation </h5>

          <Form onSubmit = {this.handleSubmit} noValidate>
            
                <Form.Control
                name = "verNum"
                className = {formErrors.verNum.length > 0 ? "error" : null } 
                placeholder = "Verification no" 
                noValidate 
                onChange = {this.handleChange} 
                />
                {formErrors.verNum.length > 0 ?
                  <span className = "errorMessage" >{formErrors.verNum}</span>
                :[
                  (status ? <span className = "successMessage"> {firstName} registered this number on {regDate} at {branch} </span>
                  : <span className = "errorMessage" > could not find BVN! please try again. </span> )
                ]}
                
                

            <div className = "submit-group" >
              <Button type = "submit" className = "submit-button" >
                Validate
              </Button>
            </div>
          </Form>
        </div>
      </div>
      
    );
    
    
  }


} 

export default App;
