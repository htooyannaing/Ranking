import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { setLocale } from "../actions";

const { Header } = Layout;

class Headerr extends Component {
	renderSignOutLink() {
		if (!this.props.auth) {
			return null;
		} else {
			return (
				<Menu.Item key="4" style={{ float: "right" }}>
					<Link to="/signout">Sign Out</Link>
				</Menu.Item>
			);
		}
	}
	render() {
		return (
			<Layout style={{ marginBottom: 100 }}>
				<Header
					style={{
						position: "fixed",
						zIndex: 1,
						width: "100%"
					}}>
					<Link to="/home" className="logo">
						SR FRAMEWORK
					</Link>
					<Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px" }}>
						<Menu.Item key="1">
							<Link to="/about" />AboutUs
						</Menu.Item>
						<Menu.Item key="2" onClick={() => this.props.setLocale("en")}>
							EN
						</Menu.Item>
						<Menu.Item key="3" onClick={() => this.props.setLocale("bm")}>
							MM
						</Menu.Item>
						{this.renderSignOutLink()}
					</Menu>
				</Header>
			</Layout>
		);
	}
}

const mapStateToProps = ({ auth }) => {
	return { auth };
};

export default connect(
	mapStateToProps,
	{ setLocale }
)(Headerr);
