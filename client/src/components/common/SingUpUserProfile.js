import React, { Component } from 'react'
import { Form, Input, Button, DatePicker, Upload, Icon, Modal } from 'antd'
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import * as actions from "../../actions"

const FormItem = Form.Item

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

const UserProfileSignUpForm = Form.create()(props => {
    const { getFieldDecorator } = props.form

    return (
        <Form onSubmit={props.onSubmit}>
            <FormItem {...formItemLayout} label="Name" >
                { getFieldDecorator("name", {
                    rules: [
                        {
                            required: true, message: "Please input your Name!"
                        }
                    ]
                })(
                    <Input placeholder="Name"/>
                )
                }
            </FormItem>
            <FormItem {...formItemLayout} label="NRC" >
                { getFieldDecorator("nrc", {
                    rules: [
                        {
                            required: true, message: "Please input NRC!"
                        }
                    ]
                })(
                    <Input placeholder="NRC"/>
                )
                }
            </FormItem>
            <FormItem {...formItemLayout} label="Phone Number">
                { getFieldDecorator("ph_no", {
                    rules: [
                        {
                            required: true, message: "Please input your Phone Number!"
                        }
                    ]
                })(
                    <Input placeholder="Phone Number"/>
                )
                }
            </FormItem>
            <FormItem {...formItemLayout} label="University Name">
                { getFieldDecorator("uni_name", {
                    rules: [
                        {
                            required: true, message: "Please input your University Name!"
                        }
                    ]
                })(
                    <Input placeholder="University Name"/>
                )
                }
            </FormItem>
            <FormItem {...formItemLayout} label="Attended Year">
                { getFieldDecorator("att_year", {
                    rules: [
                        {
                            required: true, message: "Please input your Attended Year!"
                        }
                    ]
                })(
                    <Input placeholder="Attended Year"/>
                )
                }
            </FormItem>
            <FormItem {...formItemLayout} label="DOB">
                { getFieldDecorator("dob", {
                    rules: [
                        {
                            required: true, message: "Please input your Date of birth"
                        }
                    ]
                })(
                    <DatePicker size="large" />
                )
                }
            </FormItem>
            <FormItem {...formItemLayout} label="Profile Image">
                { getFieldDecorator("profile_img", {

                })(
                    <UploadProfileImg />
                )}
            </FormItem>
            <FormItem>
				<Button type="primary" htmlType="submit" className="right">
					SignUp
				</Button>
				<Link to="/signup">Back</Link>
			</FormItem>
        </Form> 
    )
})

class UploadProfileImg extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
      };

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
        console.log(file.url || file.thumbUrl);
        
    }

    handleChange = ({ fileList }) => {
        this.setState({fileList})        
    }
    render() {
        
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        const props = {
            action: "/api/upload"
        }
        return (
          <div className="clearfix">
            <Upload
                {...props}
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              name = "file"
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        );
    }
}

class SignUpUserProfile extends Component {
    handleSubmit = e => {
        e.preventDefault()
        this.form.validateFields(async (err, values) => {
            if(!err) {  
                try {
                    this.props.history.push('/home')
                } catch (err) {
                    console.log(err);
                    
                }
            }
        })
    }

    saveFormRef = form => {
		this.form = form;
	};

    render() {
        return(
            <div className="signup-box">
				<div className="signup-text">User Profile SignUp</div>

                <UserProfileSignUpForm 
                    ref = {this.saveFormRef}
                    onSubmit = {this.handleSubmit}
                />
			</div>
        )
    }
}

export default connect(
	null,
	{ actions }
)(SignUpUserProfile);
