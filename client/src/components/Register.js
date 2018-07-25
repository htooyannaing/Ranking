import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Input, Button } from "antd";
import * as actions from "../actions";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const RegistrationForm  = Form.create()(props => {
	const { getFieldDecorator } = props.form;
	return (
		<Form onSubmit={props.onSubmit}>
      <FormItem {...formItemLayout} label="Name">
        {getFieldDecorator("uniname", {
          rules: [{ required: true, message: "Please input your Name!" }]
        })(<Input placeholder="Name" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Email">
        {getFieldDecorator("uni_mail", {
          rules: [{ required: true, message: "Please input your Email!" }]
        })(<Input placeholder="Email" />)}
      </FormItem>
      <FormItem>
        <Button type="primary" htmlType="submit" className="right">
          Register
        </Button>
        <Link to="/">SignIn</Link>
      </FormItem>
    </Form>
  );
});

/** container component */
class Register  extends Component {
  state = {
    user: {},
    submitted: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (!err) {
        let { user } = this.state;
        user.uniname = values.uniname;
        user.uni_mail = values.uni_mail;
        console.log("user", user.uniname);

        this.setState({
          user: {}
        });
        console.log(user);

        this.form.resetFields();
        const User = this.props.register(user);
        this.props.history.push(`api/updateUniversity`);
      }
    });
  };
  saveFormRef = form => {
    this.form = form;
  };
  render() { 
    if (this.props.user) {
      console.log(this.props.user);
    }
    return (
      <div className="signup-box">
        <div className="signup-text">Register</div> 
        <RegistrationForm
          ref={this.saveFormRef}
          onSubmit={this.handleSubmit}
          submitted={this.state.submitted}
        />
      </div>
    );
  }
}

//map state to component props...
function mapStateToProps(state) {
  console.log("register", state.registerUser);
  return {
    user: state.registerUser
  };
}
export default connect(
  mapStateToProps,
  actions
)(Register);

