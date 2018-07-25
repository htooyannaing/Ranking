import React, { Component } from "react";
import { Select, Checkbox, Input, Row, Col } from "antd";
import { fetchValidateType } from "../actions";
import { connect } from "react-redux";

const Option = Select.Option;
var count = 1;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tbName: "User",
      columns: [],
      checked: {},
      text: {},
      items: [],
      uniName: "University Of Computer Studies"
    };
    // console.log(this.state.checked);
  }

  /**default fectching column names if start pageload */
  componentDidMount() {
    this.props.fetchValidateType("User");
  }
  static getDerivedStateFromProps = (nextProps, prevState) => {
    let checked = {};
    let columns = [];
    let textdata = {};
    if (nextProps.validatetype !== prevState.validatetype) {
      nextProps.validatetype.map(col => {
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
    } else return null;
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

  /**table name event->depend on table name to show column names*/
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
    const { tbName, uniName, text } = this.state;
    console.log("text ", text);
    let uniObj = {};
    if (this.props.validateType.uniDataList) {
      let index = this.props.validateType.uniDataList.findIndex(
        uni => uni.uniname === uniName
      );
      uniObj = this.props.validateType.uniDataList[index];
    }
    console.log("Uni Obj ", uniObj);

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
        <br />
        <div>
          {tbName == "User" ? (
            this.props.validateType.User ? (
              this.props.validateType.User.map((user, index) => (
                <Row gutter={16}>
                  <Col key={index} className="gutter-row" span={6}>
                    <Checkbox
                      defaultChecked={true}
                      onChange={() => this.toggleChecked(user.column_name)}
                    >
                      {user.column_full_name}
                    </Checkbox>
                    <Input
                      onChange={this.handleInputChange}
                      placeholder={user.column_full_name}
                      name={user.column_name}
                      className="search-box"
                      style={{ width: 260 }}
                    />
                  </Col>
                </Row>
              ))
            ) : null
          ) : (
            <div>
              <div style={{ marginTop: 20 }}>
                <Select
                  className="search-box"
                  style={{ width: 260 }}
                  defaultValue="University Name"
                  onChange={this.handleSelectBoxChange}
                >
                  {this.props.validateType.uniDataList
                    ? this.props.validateType.uniDataList.map(
                        (option, index) => (
                          <Option key={index} value={option.uniname}>
                            {option.uniname}
                          </Option>
                        )
                      )
                    : null}
                </Select>
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
              </div>

              <Row>
                {this.props.validateType.University
                  ? this.props.validateType.University.map(post => (
                      <Col className="gutter-row" span={8}>
                        {post.control_type == 1 ? (
                          <div>
                            <Checkbox
                              defaultChecked={true}
                              onChange={() =>
                                this.toggleChecked(post.column_name)
                              }
                            />
                            <Input
                              placeholder={post.column_full_name}
                              className="search-box"
                              name={post.column_name}
                              onChange={this.handleInputChange}
                            />
                          </div>
                        ) : null}
                      </Col>
                    ))
                  : null}
              </Row>
            </div>
          )}
        </div>
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
