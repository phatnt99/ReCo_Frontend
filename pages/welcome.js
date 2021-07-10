import React, { useEffect } from "react";
import { useRouter } from "next/router";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Auth from "../layouts/Auth";

function Welcome() {

  return (
    <>
      <Col lg="10" md="10">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
              <p>Tài khoản của bạn đang được xử lí, vui lòng thử lại sau!</p>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

Welcome.layout = Auth;
Welcome.title="Chào mừng";

export default Welcome;
