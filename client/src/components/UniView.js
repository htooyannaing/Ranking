import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../actions";
import "../style/style.css";
import Search from "./Search";
import {
  Form,
  Input,
  Table,
  Button,
  Pagination,
  Popconfirm,
  message
} from "antd";

const FormItem = Form.Item;

let button = {
  emptyText: "Button"
};

class UniView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      uni: {},
      pgno: 0,
      limit: 5,
      pagination: {}
    };
  }
  onDelete = uniId => {
    this.props.uniDelete(uniId);
    const { pgno, limit } = this.state;
    this.props.fetchUniList({ pgno, limit });
  };
  handleTableChange = pagination => {
    const { limit } = this.state;
    const pgno = pagination.current * limit - limit;
    this.props.fetchUniList({ pgno, limit });
    this.setState({ pgno, limit });
  };

  componentDidMount() {
    const { pgno, limit } = this.state;
    this.props.fetchUniList({ pgno, limit });
    const count = this.props.countList();
    // console.log("ccc", count);
  }
  onDelete = uniId => {
    this.props.uniDelete(uniId);
    this.props.fetchUniList();
  };
  cancelDelete = e => {
    console.log("cancel delete ", e);
  };

  render() {
    let Uni;

    this.props.uniList.length !== 0
      ? this.props.uniList
        ? (Uni = this.props.uniList.uniArr.map((uni, index) => {
            return {
              uniname: uni.uniname,
              uni_mail: uni.uni_mail,
              // password: uni.password,
              ph_no: uni.ph_no,
              address: uni.address,
              // academic_started_year: uni.academic_started_year,
              // academic_ended_year: uni.academic_ended_year,
              // degree: uni.degree,
              // majors: uni.majors,

              // age: 32,
              // address: `Yangon, Str no. ${i}`,
              button: (
                <FormItem>
                  <Button className="btn">
                    <Link to={"/update/" + uni.id}>Update</Link>
                  </Button>
                  <Button className="btn">
                    <Link to={"/checkuni/" + uni.id}>Check</Link>
                  </Button>
                  <Button type="danger" htmlType="submit" className="btn">
                    <Popconfirm
                      title="Are you sure delete?"
                      onConfirm={() => this.onDelete(uni.id)}
                      onCancel={this.cancelDelete}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Link to={"/delete/" + uni.id}>Delete</Link>
                    </Popconfirm>
                  </Button>
                </FormItem>
              )
            };
          }))
        : ""
      : "";
    let btn = {
      title: "Btn",
      dataIndex: "button",
      key: "Btn",
      fixed: "right",
      width: 300
    };
    const cols = [...this.props.columns, btn];
    console.log("Col ", cols);

    function confirm(e) {
      message.success("Click on Yes");
    }

    function cancel(e) {
      message.error("Click on No");
    }
    const count = this.props.uniList.count;
    const pagination = { ...this.state.pagination };

    pagination.total = count;
    console.log("colu", cols);

    return (
      <div className="mainpage">
        <Form>
          <FormItem>
            {this.props.columns.length > 0 ? (
              <div>
                <Table
                  dataSource={Uni}
                  size="small"
                  scroll={{ x: 2000 }}
                  columns={cols}
                  pagination={pagination}
                />
              </div>
            ) : null}
          </FormItem>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("uniobj", state.uniList);

  return {
    uniList: state.uniList
  };
}
export default connect(
  mapStateToProps,
  actions
)(UniView);
