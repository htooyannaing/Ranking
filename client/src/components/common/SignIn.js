import React, { Component } from "react";
import { Form, Input, Button, Icon } from "antd";
import { connect } from "react-redux";
import { signinAdmin } from "../../actions";
import { log } from "util";
const FormItem = Form.Item;

/**creating login form design and validating email and password
 * if it isn't equal admin name and password, to show error.
 * if it equals admin name and password, go to other page.
 */
const LoginForm = Form.create()(props => {
  const { getFieldDecorator } = props.form;
  return (
    <Form onSubmit={props.onSubmit} className="form-size form-margin">
      <FormItem>
        {getFieldDecorator("mail", {
          rules: [
            {
              type: "email",
              message: "The input is not valid E-mail!"
            },
            { required: true, message: "Please input your email!" }
          ]
        })(
          <Input
            prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Email"
          />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator("password", {
          rules: [
            {
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
              message:
                " Please Minimum eight characters, at least one uppercase letter, one lowercase letter and one number!"
            },
            { required: true, message: "Please input your Password!" }
          ]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="Password"
          />
        )}
      </FormItem>
      <FormItem>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </FormItem>
      <span style={{ color: "red" }}>{props.loginMessage}</span>
    </Form>
  );
});

class SignIn extends Component {
  state = {
    loginStatus: false,
    loginMessage: ""
  };
  /**if click login button , to pass email and password
   * if correct email and password, go to other page
   * else show error
   */
  handleSubmit = e => {
    e.preventDefault();
    this.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.signinAdmin(values.mail, values.password);
        if (this.props.user) {
          this.props.history.push("/home");
        } else {
          this.setState({
            loginMessage: "Fail to login"
          });
        }
      }
    });
  };
  saveFormRef = form => {
    this.form = form;
  };
  render() {
    return (
      <div className="login-box">
        <div className="col col-md-12 col-sm-12 ">
          <span className="fontBold">SignIn</span>
          <LoginForm
            ref={this.saveFormRef}
            onSubmit={this.handleSubmit}
            loginMessage={this.state.loginMessage}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("log", state.auth);

  return { user: state.auth };
}

export default connect(
  mapStateToProps,
  { signinAdmin }
)(SignIn);
