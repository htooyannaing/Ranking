import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import SignUp from "./common/SignUp";
import messages from "../const/messages";
import Header from "./Header";
import NotFound from "./NotFound";
import SignIn from "./common/SignIn";
import ForgotPassword from "./common/ForgotPassword";
import Search from "../components/Searchssss";
import Register from "./Register";
import ForgotPasswordComfirm from "./common/ForgotPasswordConfirmation";
import SignUpComfirmation from "./common/SignUpConfirmation";
import SignUpUserProfile from "./common/SingUpUserProfile";
import AboutUS from "./common/AboutUS";
import SignOut from "./common/SignOut";
import CheckOut from "./common/CheckOut";
import UpdateForm from "./UpdateForm"
import checkoutuni from "./common/checkoutuni";
import UniView from "./UniView";
import updateUniversity from "./updateUniversity";

//import Search from "antd/lib/input/Search";

class App extends Component {
  render() {
    const { lang } = this.props;
    return (
      <IntlProvider locale={lang} messages={messages[lang]}>
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={SignIn} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/signout" component={SignOut} />
              <Route exact path="/home" component={Search} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/about" component={AboutUS} />
              <Route exact path="/forgot" component={ForgotPassword} />
              <Route
                exact
                path="/forgot/comfirm"
                component={ForgotPasswordComfirm}
              />
              <Route
                exact
                path="/signup/comfirm"
                component={SignUpComfirmation}
              />
              {/* <Route exect path="/tableview" component={TableView} /> */}
              {/* <Route exect path="/search" component={search} /> */}
              <Route exect path="/check/:id" component={CheckOut} />
              <Route exect path="/checkuni/:id" component={checkoutuni} />
              <Route exect path="/update/:id" component={UpdateForm} />
              <Route exect path="/update/:id" component={updateUniversity} />
              <Route
                exact
                path="/singupuserprofile"
                component={SignUpUserProfile}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </IntlProvider>
    );
  }
}
function mapStateToProps({ locale }) {
  return {
    lang: locale
  };
}

export default connect(mapStateToProps)(App);
