import React, { Component } from "react";
import { Select, Checkbox, Input } from "antd";
import { connect } from "react-redux";
import { fetchValidateType } from "../actions";

const Option = Select.Option;

const posts = [
  { id: 1, title: "mail", content: "Welcome to learning React!" },
  { id: 2, title: "password", content: "You can install React from npm." }
];
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { tbName: {posts}, columns: [], checked: {} };
    // this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    this.props.fetchValidateType("University");
  }
  handleChange = value => {
    //console.log(`selected ${value}`);
    this.setState = { tbName: value };
  };
  toggleChecked = title => {
    const index = this.state.columns.findIndex(col => col["title"] === title);
    let columns = [...this.state.columns];
    let button = {
      title: "button",
      dataIndex: "button",
      key: "button"
    };

    if (index === -1) {
      let column = {
        title: title,
        dataIndex: title,
        key: title
      };
      columns = [...this.state.columns, column];
    } else {
      columns.splice(index, 1);
    }
    this.setState(previousState => {
      const checked = { ...previousState.checked };

      checked[title] = !checked[title];
      console.log("uncheck", checked[title]);

      return { checked, columns };
    });
  };
  
  render() {
    var data = JSON.stringify(this.state.tbName);
    // console.log(data, "data");

    var res = JSON.parse(data);
    // console.log(res.posts, "rres");

    const content = this.state.checked ? (
      <div className="example-input">
        <Input size="large" placeholder="Basic usage" />
      </div>
    ) : null;
    console.log("Validate" ,this.props.validateType);
    //const json = JSON.parse(type);
    //console.log("Type" , json.table_name);
    //console.log("Type",type);
    //console.log("validateType ", this.props.validateType);
    
    return (
      <div className="search-border">
        <Select
          defaultValue="User"
          style={{ width: 120 }}
          onChange={e => {
            if (e == "User") {
              this.setState({ tbName: { posts } });
            } else {
              console.log("Another");
            }
            //  if(EventTarget.value)
          }}
          className="tb-dropdown"
        >
          <Option value="User">User</Option>
          <Option value="Userprofile">Userprofile</Option>
          <Option value="University">University</Option>
        </Select>
        <ul className="checkbox">
          {this.props.validateType
            ? this.props.validateType.map((post, index) => (
                <div key={index}>
                  <Checkbox
                    checked={this.state.checked[post.title]}
                    onChange={() => this.toggleChecked(post.title)}
                  >
                    {post.column_name}
                  </Checkbox>
                      {post.control_type == 1
                      ? <Input placeholder = {post.column_name} /> 
                      : <Select defaultValue="lucy" style={{ width: 120 }}>
                          <Option value="jack">Jack</Option>
                          <Option value="lucy">Lucy</Option>
                          <Option value="disabled" disabled>Disabled</Option>
                          <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                    }
                </div>
              ))
            : null}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    validateType:state.validatetype
  };
}

export default connect(
	mapStateToProps,
	{ fetchValidateType }
)(Search);
