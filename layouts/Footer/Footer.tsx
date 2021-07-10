/*eslint-disable*/
import React from "react";

// reactstrap components
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";

function Footer() {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              ReCo Application
            </a>
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              
            </NavItem>

            <NavItem>
              
            </NavItem>

            <NavItem>
              
            </NavItem>

            <NavItem>
              <NavLink
                href="#"
                rel="noopener noreferrer"
                target="_blank"
              >
                We serve the best.
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
