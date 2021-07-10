import React from "react";
// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import AuthNavbar from "./Navbar/AuthNavbar";
import AuthFooter from "./Footer/Footer";

function Auth(props) {
  React.useEffect(() => {
    document.body.classList.add("bg-default");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.remove("bg-default");
    };
  }, []);
  return (
    <>
      <div className="main-content">
        <div className="header bg-gradient-info py-7 py-lg-8">
          <Container>
            <div className="header-body text-center mb-4">
              <Row className="justify-content-center">
                <Col lg="6" md="7">
                  <h1
                    style={{ textAlign: "center", fontFamily: "Bangers" }}
                    className="display-1"
                  >
                    ReCo
                  </h1>
                  <p
                    className="text-lead"
                    style={{ color: "#ffffff", fontWeight: "bold" }}
                  >
                    Khám phá hàng trăm nhà hàng đủ mọi loại hình hoặc tham gia
                    vào đội ngũ đối tác đầy tiềm năng cùng chúng tôi!
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">{props.children}</Row>
        </Container>
      </div>
    </>
  );
}

export default Auth;
