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

class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      data: [],
      pgno: 0,
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

    const { limit } = this.state;
    const pgno = pagination.current * limit - limit;
    this.props.fetchUserList({ pgno, limit });
    this.setState({ pgno, limit });
  };
  // const count = this.props.countList();
  // console.log("c", count);

  componentDidMount() {
    const { pgno, limit } = this.state;
    const cc = this.props.fetchUserList({ pgno, limit });
    // const count = this.props.countList();
    console.log("ccc", cc);
  }

  //   static getDerivedStateFromProps = (nextProps, prevState) => {
  //     // console.log(nextProps);
  //     // console.log(prevState);
  //   };

  render() {
    let User;
    console.log("prop", this.props.userList);

    this.props.userList.length !== 0
      ? this.props.userList
        ? (User = this.props.userList.userArr.map((user, index) => {
            console.log("USER => ", this.props.fetchuserList);

            return {
              mail: user.mail,
              password: user.password,
              button: (
                <FormItem>
                  <Button className="btn">
                    <Link to={"/update/" + user.id}>Update</Link>
                  </Button>
                  <Button className="btn">
                    <Link to={"/check/" + user.id}>Check</Link>
                  </Button>
                  <Button type="danger" htmlType="submit" className="btn">
                    <Popconfirm
                      title="Are you sure delete?"
                      onConfirm={() => this.onDelete(user.id)}
                      onCancel={this.cancelDelete}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Link to={"/delete/" + user.id}>Delete</Link>
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
    function confirm(e) {
      message.success("Click on Yes");
    }

    function cancel(e) {
      message.error("Click on No");
    }
    // console.log("Col ", cols);

    const count = this.props.fetchUserList.count;
    // console.log("count", count);

    const pagination = { ...this.state.pagination };

    pagination.total = count;
    return (
      <div className="mainpage">
        <Form>
          <FormItem>
            {this.props.columns.length > 0 ? (
              <Table
                dataSource={User}
                size="small"
                columns={cols}
                pagination={pagination}
                scroll={{ x: 2000 }}
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
  console.log("list", state.userList);

  return {
    userList: state.userList
  };
}
export default connect(
  mapStateToProps,
  actions
)(UserView);
