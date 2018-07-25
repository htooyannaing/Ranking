// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { Form, Input, Button } from "antd";
// import { signupUser } from "../../actions";
// import { connect } from "react-redux";

// const FormItem = Form.Item;
// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 6 }
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 18 }
//   }
// };

// const SignUpForm = Form.create()(props => {
// 	const { getFieldDecorator } = props.form;
// 	return (
// 		<Form onSubmit={props.onSubmit}>
// 			<FormItem {...formItemLayout} label="Email">
// 				{getFieldDecorator("email", {
// 					rules: [{ required: true, message: "Please input your Email!" }]
// 				})(<Input placeholder="Email" />)}
// 			</FormItem>

//       <FormItem {...formItemLayout} label="Password">
//         {getFieldDecorator("password", {
//           rules: [{ required: true, message: "Please input your Password!" }]
//         })(<Input type="password" placeholder="Password" />)}
//       </FormItem>
//       <FormItem {...formItemLayout} label="Comfirm Password">
//         {getFieldDecorator("comfirm", {
//           rules: [
//             { required: true, message: "Please input your comfirm Password!" }
//           ]
//         })(<Input type="password" placeholder="Comfirm Password" />)}
//       </FormItem>
//       <FormItem>
//         <Button type="primary" htmlType="submit" className="right">
//           SignUp
//         </Button>
//         <Link to="/">SignIn</Link>
//       </FormItem>
//     </Form>
//   );
// });

// class SignUp extends Component {
//   handleSubmit = e => {
//     e.preventDefault();
//     this.form.validateFields(async (err, values) => {
//       if (!err) {
//         try {
//           this.props.history.push("/singupuserprofile");
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     });
//   };
//   saveFormRef = form => {
//     this.form = form;
//   };
//   render() {
//     return (
//       <div className="signup-box">
//         <div className="signup-text">SignUp</div>

//         <SignUpForm ref={this.saveFormRef} onSubmit={this.handleSubmit} />
//       </div>
//     );
//   }
// }
// export default connect(
//   null,
//   { signupUser }
// )(SignUp);
