import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../actions";
export class Landing extends Component {
	componentDidMount = () => {
		this.props.fetchUser();
	};
	render() {
		return (
			<div>
				Landing, The current login user email is : {this.props.auth.email}
			</div>
		);
	}
}
const mapStateToProps = ({ auth }) => {
	return { auth };
};

export default connect(
	mapStateToProps,
	{ fetchUser }
)(Landing);
