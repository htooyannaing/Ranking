import React, { Component } from "react";
import { connect } from "react-redux";
import { signout } from "../../actions";
class SignOut extends Component {
	componentWillMount() {
		this.props.signout(this.props.history);
	}
	render() {
		return <div>SignOut</div>;
	}
}
export default connect(
	null,
	{ signout }
)(SignOut);
