import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const NotFound = () => {
	return (
		<div className="container">
			<center>
				<div className="notfound">
					<FormattedMessage id="lbl.notfound" defaultMessage="OPPS!" />
				</div>
				<p style={{ fontSize: 16 }}>
					<FormattedMessage
						id="lbl.desc.notfound"
						defaultMessage="It looks like that page no longer exists"
					/>
					<Link to="/">Home Page</Link> ?
				</p>
			</center>
		</div>
	);
};

export default NotFound;
