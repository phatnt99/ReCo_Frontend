import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// reactstrap components
import { Container, Spinner } from "reactstrap";
// core components
import AdminNavbar from "./Navbar/MainNavbar";
import AdminFooter from "./Footer/Footer";
import Sidebar from "./Sidebar/OwnerSidebar";
import authService from "../services/authService";

import routes from "../routes";

function OwnerLayout(props) {
  // used for checking current route
  const router = useRouter();
  let mainContentRef = React.createRef();
  const [user, setUser] = useState({});
  const [isAuthen, setIsAuthen] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  const logout = () => {
    authService.logout();
    router.push("/login");
  };

  useEffect(() => {
    setIsAuthen(true);
  }, [user]);

  useEffect(() => {
    authService.getProfile().then((res) => {
      if (res.status == 401) {
        logout();
      }
      setUser(res.data);
    });
  }, []);

  useEffect(() => {
    //check if current user doesnt have permisson
    //if so redirect him/her to login page
    const authRole = localStorage.getItem("authRole");
    if (authRole != "ROWNER") {
      router.push("/login");
    } else setIsAuthor(true);
  }, []);

  React.useEffect(() => {
    if(isAuthor && isAuthen) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      mainContentRef.current.scrollTop = 0;
    }

  }, []);

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (router.route.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  if (!isAuthen || !isAuthor)
    return (
      <div
        className="main-content"
        style={{ width: "100vw", height: "100vh", display: "flex" }}
      >
        <div style={{ margin: "auto", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Spinner
            type="grow"
            color="primary"
            style={{ width: "6rem", height: "6rem" }}
          />
          <h4>Đang tải trang, vui lòng đợi...</h4>
        </div>
      </div>
    );

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: "/img/brand/reco-logo.png",
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar {...props} brandText={getBrandText()} user={user} />
        {props.children}
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

export default OwnerLayout;
