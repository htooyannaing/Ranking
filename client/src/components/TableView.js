import React, { Component } from "react";
import { connect } from "react-redux";
import reqwest from "reqwest";
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
// const columns =[];
function confirm(e) {
  //console.log(e);
  message.success("Click on Yes");
}

function cancel(e) {
  // console.log(e);
  message.error("Click on No");
}

let button = {
  emptyText: "Button"
};

class TableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      data: [],
      pgno: 0,
      tbName: this.props.table,
      limit: 5,
      pagination: {}
    };
  }
  handleTableChange = pagination => {
    // const pager = { ...this.state.pagination };
    // pager.current = pagination.current;
    // this.setState({
    //   pagination: pager
    // });
    const tbName = this.state.tbName;
    // console.log(tbName);
    
    const { limit } = this.state;
    const pgno = pagination.current * limit - limit;
    this.props.fetchUserList({ pgno, limit, tbName });
  };

  componentDidMount() {
    const { pgno, limit, tbName } = this.state;
    this.props.fetchUserList({ pgno, limit, tbName });
  }
  
  render() {
    let User;
    // console.log(this.state.tbName);

    this.props.userList.length !== 0
      ? this.props.userList
        ? (User = this.props.userList.map((user, index) => {
            // console.log("USER => ", this.props.userList);

            return {
              mail: user.mail,
              password: user.password,
              ph_no: user.ph_no,
              // age: 32,
              // address: `Yangon, Str no. ${i}`,
              button: (
                <FormItem>
                  <Button type="primary" htmlType="submit" className="button">
                    Update
                  </Button>
                  <Button>
                    <Link to={`/check/${user.id}/${this.state.tbName}`}>Check</Link>
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
      key: "Btn"
    };
    const cols = [...this.props.columns, btn];
    // console.log("Col ", cols);

    const count = this.props.userList.length;
    // console.log("count", count);

    const pagination = { ...this.state.pagination };

    pagination.total = 20;

    return (
      <div className="mainpage">
        <Form>
          <FormItem>
            {this.props.columns.length > 0 ? (
              <Table
                dataSource={User}
                columns={cols}
                pagination={pagination}
                onChange={this.handleTableChange}
              />
            ) : null}
          </FormItem>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("cout", state.userList);

  return {
    userList: state.userList
  };
}
export default connect(
  mapStateToProps,
  actions
)(TableView);
