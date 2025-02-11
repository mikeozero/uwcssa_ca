import React, { useEffect, useState } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { fetchUserProfile, loadUser } from "./redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";

import Account from "./containers/account/AccountRouter";
import AdminRouter from "./containers/admin/AdminRouter";
import Amplify from "aws-amplify";
import ArticleRouter from "./containers/article/ArticleRouter";
import AuthRouter from "./containers/authentication/AuthenticationRouter";
import BottomNav from "./containers/BottomNav";
import Career from "./containers/CareerRouter";
import ContactUs from "./containers/ContactUs";
import CustomAlert from "./components/CustomMUI/CustomAlert";
import DeskTopDrawer from "./containers/DeskTopDrawer";
import EventRouter from "./containers/event/EventRouter";
import ForumRouter from "./containers/forum/ForumRouter";
import FoundingMember from "./containers/FoundingMember";
import Home from "./containers/Home";
import Kanban from "./containers/Kanban";
import MarketRouter from "./containers/market/MarketRouter";
import NoPermission from "./containers/NoPermission";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./Hooks/ScrollToTop";
import StaffRouter from "./containers/staff/StaffRouter";
import TestRouter from "./containers/test/TestRouter";
import UserFeedBack from "./containers/UserFeedBack";
import UwcssaMember from "./containers/UwcssaMember";
import awsconfig from "./aws-exports";
import { switchTheme } from "./redux/slice/generalSlice";

Amplify.configure(awsconfig);

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function initialUser() {
      const response = await dispatch(loadUser());
      // console.log("loadUser", response);
      if (response.meta.requestStatus === "fulfilled") {
        const { username } = response.payload;
        dispatch(fetchUserProfile({ username }));
      }
    }
    initialUser();
  }, [dispatch]);
  const { darkTheme } = useSelector((state) => state.general);
  const theme = createTheme({
    typography: {
      fontFamily: "Noto Sans SC",
    },
    palette: {
      mode: darkTheme ? "dark" : "light",
    },
  });

  useEffect(() => {
    // Add listener to update styles  onSelectMode(e.matches ? 'dark' : 'light')
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) =>
        dispatch(switchTheme(e.matches ? true : false))
      );

    // Setup dark/light mode for the first time
    dispatch(
      switchTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches ? true : false
      )
    );
    // Remove listener
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, [dispatch]);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  // console.log("isAlertOpen", isAlertOpen);
  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const handleAlertClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsAlertOpen(false);
  };

  useEffect(() => {
    setIsAlertOpen(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <DeskTopDrawer>
          <Switch>
            <Route path="/" exact component={Home} />
            <PrivateRoute
              allowRoles="admin"
              path="/admin"
              component={AdminRouter}
            />
            <Route path="/auth" component={AuthRouter} />
            <PrivateRoute
              allowRoles="anyone"
              path="/account"
              component={Account}
            />
            <PrivateRoute
              allowRoles="staff"
              path="/staff"
              component={StaffRouter}
            />
            <Route path="/kanban" component={Kanban} />
            <Route path="/article" component={ArticleRouter} />
            <Route path="/market" component={MarketRouter} /> 
            <Route path="/forum" component={ForumRouter} />
            <Route path="/foundingMember" exact component={FoundingMember} />
            <Route path="/uwcssaMember" exact component={UwcssaMember} />
            <Route path="/contactUs" exact component={ContactUs} />
            <Route path="/career" component={Career} />
            <Route path="/event" component={EventRouter} />
            <Route path="/rating" exact component={UserFeedBack} />
            <Route path="/test" component={TestRouter} />
            <Route exact path="/NoPermission" component={NoPermission} />
            <Redirect to="/not-found">404 Not Found!</Redirect>
          </Switch>
        </DeskTopDrawer>
        <BottomNav />
        <CustomAlert
          isAlertOpen={isAlertOpen}
          handleAlertClose={handleAlertClose}
          message={"登錄成功"}
        />
      </Router>
    </ThemeProvider>
  );
}
