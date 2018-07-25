import React, { Component } from "react";
import { Select, Checkbox, Button, Input, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { fetchValidateType } from "../actions";
import { connect } from "react-redux";
import UniView from "./UniView";
import UserView from "./UserView";

const Option = Select.Option;
var count = 1;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tbName: "User",
      columns: [],
      checked: {},
      text: "",
      searchText: "",
      items: [],
      uniName: "UCSP"
    };
    // console.log(this.state.checked);
  }
  filterList = event => {
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item) {
      return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({ items: updatedList });
  };

  /**default fectching column names */
  componentDidMount() {
    this.props.fetchValidateType("User");
  }
  static getDerivedStateFromProps = (nextProps, prevState) => {
    let checked = {};
    let columns = [];
    let textdata = {};

    if (nextProps.validateType !== undefined) {
      if (nextProps.validateType.User !== prevState.validateType) {
        nextProps.validateType.User.map(col => {
          let column = col.column_name;
          checked[column] =
            typeof prevState.checked[column] === "undefined"
              ? true
              : prevState.checked[column];
          if (checked[column]) {
            let colObj = {
              title: col.column_name,
              dataIndex: col.column_name,
              key: col.column_name
            };

            columns.push(colObj);
          }
        });
        
        return { checked, columns };
      } else if (nextProps.validateType.University !== prevState.validateType) {
        nextProps.validateType.University.map(col => {
          let column = col.column_name;
          checked[column] =
            typeof prevState.checked[column] === "undefined"
              ? true
              : prevState.checked[column];
          if (checked[column]) {
            let colObj = {
              title: col.column_name,
              dataIndex: col.column_name,
              key: col.column_name
            };
            columns.push(colObj);
          }
        });
        return { checked, columns };
      }
    }
  };

  handleChange = value => {
    this.setState = { tbName: value };
  };

  /**checkbox event */
  toggleChecked = title => {
    this.setState(previousState => {
      const checked = { ...previousState.checked };
      checked[title] = !checked[title];
      console.log("checked", checked);
      return { checked };
    });
  };

  /*Table Name select box event change*/
  handleSelectChange = e => {
    this.props.fetchValidateType(e);
    this.setState({ tbName: e });
    console.log("event", e);
  };

  handleInputChange = e => {
    const text = this.state.text;
    text[e.target.name] = e.target.value;
    this.setState({ text });
  };

  handleSelectBoxChange = e => {
    this.setState({ uniName: e });
    console.log("uniName", e);
  };

  render() {
    const { tbName, uniName } = this.state;

    let uniObj = {};
    if (this.props.validateType.uniDataList) {
      let index = this.props.validateType.uniDataList.findIndex(
        uni => uni.uniname === uniName
      );
      uniObj = this.props.validateType.uniDataList[index];
    }
    console.log("Uni Obj ", this.state.columns);

    console.log("text", this.state.text);

    return (
      <div className="search-border">
        <Select
          defaultValue="User"
          style={{ width: 180 }}
          onChange={this.handleSelectChange}
        >
          <Option value="User">User</Option>
          <Option value="University">University</Option>
        </Select>
        <Button type="primary" htmlType="submit" className="right">
          <Link to="/">LogOut</Link>
        </Button>
        <Button type="primary" htmlType="submit" className="right">
          <Link to="/register">Register</Link>
        </Button>
        <br />
        {tbName == "User" ? (
          <div>
            {this.props.validateType.User
              ? this.props.validateType.User.map((user, index) => (
                  <div>
                    <Checkbox
                      defaultChecked={true}
                      onChange={() => this.toggleChecked(user.column_name)}
                    >
                      {user.column_name}
                    </Checkbox>

                    <Input
                      onChange={this.handleInputChange}
                      placeholder={user.column_name}
                      className="search-box"
                      name={user.column_name}
                      style={{ width: 260 }}
                    />
                  </div>
                ))
              : null}
            <UserView columns={this.state.columns} />
          </div>
        ) : (
          <div>
            <div>
              <Checkbox
                defaultChecked={true}
                onChange={() => this.toggleChecked("uniname")}
              />
              <Select
                className="search-box"
                style={{ width: 260 }}
                defaultValue="University Name"
                onChange={this.handleSelectBoxChange}
              >
                {this.props.validateType.uniDataList
                  ? this.props.validateType.uniDataList.map((option, index) => (
                      <Option key={index} value={option.uniname}>
                        {option.uniname}
                      </Option>
                    ))
                  : null}
              </Select>
              <Checkbox
                defaultChecked={true}
                onChange={() => this.toggleChecked("degree_name")}
              />
              {
                <Select
                  className="search-box"
                  style={{ width: 260 }}
                  defaultValue="Degree"
                >
                  {uniObj["degree"]
                    ? uniObj["degree"].map(option => (
                        <Option value={option.name}>{option.name}</Option>
                      ))
                    : null}
                </Select>
              }
              <Checkbox
                defaultChecked={true}
                onChange={() => this.toggleChecked("major_name")}
              />
              {
                <Select
                  className="search-box"
                  style={{ width: 260 }}
                  defaultValue="Major"
                >
                  {uniObj["majors"]
                    ? uniObj["majors"].map(option => (
                        <Option value={option.name}>{option.name}</Option>
                      ))
                    : null}
                </Select>
              }
            </div>
            {this.props.validateType.University
              ? this.props.validateType.University.map(post => (
                  <div>
                    {post.control_type == 1 ? (
                      <div>
                        <Checkbox
                          defaultChecked={true}
                          onChange={() => this.toggleChecked(post.column_name)}
                        />
                        {post.column_name}
                        <Input
                          placeholder={post.column_name}
                          className="search-box"
                          style={{ width: 260 }}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    ) : null}
                  </div>
                ))
              : null}
            <UniView id="myTable" columns={this.state.columns} />
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    validateType: state.validatetype
  };
}

export default connect(
  mapStateToProps,
  { fetchValidateType }
)(Search);
