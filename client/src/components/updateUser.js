import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../actions";
import "../style/style.css";
import Search from "./Search";
import { Form, Input, Button, Row, Col, Icon } from "antd";
import FormItem from "antd/lib/form/FormItem";

const Update = Form.create({
  mapPropsToFields(props) {
    console.log("PROPS ", props);
    return {
      uniname: Form.createFormField({
        value: props.datacollect.uniname
      }),
      address: Form.createFormField({
        value: props.datacollect.address
      }),
      phone: Form.createFormField({
        value: props.datacollect.phone
      }),
      gender: Form.createFormField({
        value: props.datacollect.gender
      }),
      nrc: Form.createFormField({
        value: props.datacollect.nrc
      })
    };
  }
})(props => {
  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };

  return (
    <Form onSubmit={props.onSubmit}>
      <FormItem {...formItemLayout} label="Name">
        {getFieldDecorator("name", {
          rules: [{ required: true, message: "Please input your Name!" }]
        })(<Input placeholder="Name" />)}
      </FormItem>

      <FormItem {...formItemLayout} label="Email">
        {getFieldDecorator("mail", {
          rules: [{ required: true, message: "Please input your Email!" }]
        })(<Input placeholder="Email" />)}
      </FormItem>
      <FormItem>
        <Button type="primary" htmlType="submit" className="right">
          Update
        </Button>
        <Link to="/home">Back</Link>
      </FormItem>
    </Form>
  );
});

const find = function(data, dataList) {
  if (!dataList) {
    return "";
  }
  dataList.map(profile => {
    if (dataList._id === data) {
      return profile;
    }
  });
};

class UpdateForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profiles: [],
      datafind: []
    };
  }
  componentDidMount() {
    console.log("userlist", this.props.userList);

    const id = this.props.match.params.id;
    const collect = this.props.user.userArr;
    collect.map(profiles => {
      if (profiles.id !== id) {
      } else {
        this.setState({ profiles: profiles });
      }
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (!err) {
        let { profiles } = this.state;
        profiles.name = values.name;
        profiles.mail = values.mail;

        this.setState({
          profiles: {},
          datafind: []
        });
        console.log(profiles);

        this.form.resetFields();
        this.props.register(profiles);
        console.log("update", profiles);

        // this.props.history.push(`api/updateUniversity`);
      }
    });
  };
  saveFormRef = form => {
    this.form = form;
  };
  render() {
    return (
      <div className="ms-container">
        <Row type="flex" justify="center">
          <Col span={14}>
            <Update
              ref={this.saveFormRef}
              datacollect={this.state.profiles}
              onSubmit={this.handleSubmit}
              submitted={this.state.submitted}
            />
          </Col>
          <Col span={2} />
        </Row>
      </div>
    );
  }
}
function mapStateToProps(state) {
  console.log("update", state.userList);
  return {
    user: state.userList
  };
}
export default connect(
  mapStateToProps,
  actions
)(UpdateForm);
