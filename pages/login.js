import React, { useEffect, useRef, useState } from "react";
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
import { useForm } from "react-hook-form";
import Link from "next/link";
// layout for this page
import Auth from "../layouts/Auth";
import authService from "../services/authService";
import authRoute from "../authRoute";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState();
  const passwordRef = useRef();

  useEffect(() => {
    // check for authenticate
    const auth = localStorage.getItem("auth");
    if (auth != null) {
      const authRole = localStorage.getItem("authRole");
      if (authRole == "ADMIN") {
        router.push(authRoute.admin.route);
      } else if (authRole == "ROWNER") {
        router.push(authRoute.owner.route);
      }
    }
  }, []);

  const login = (data) => {
    console.log("vao ");
    const { username, password } = data;
    authService.login(username, password).then((res) => {
      console.log(res);
      if (res.status == 401) {
        console.log("O day set ten sai ne");
        // mean login fail
        // clear password
        setErrorMsg("Sai tên đăng nhập hoặc mật khẩu.");
      } else {
        // login successful
        // if  account is blocked or waiting for approve
        if (res.data.status == 1 || res.data.status == 3) {
          router.push("/welcome");
          return;
        }
        localStorage.setItem("auth", res.data.token);
        localStorage.setItem("authId", res.data.id);
        localStorage.setItem("authRole", res.data.role);
        // must return att to indicate user or admin
        if (res.data.role == authRoute.admin.role) {
          router.push(authRoute.admin.route);
        }
        if (res.data.role == authRoute.owner.role) {
          router.push(authRoute.owner.route);
        }
      }
    });
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Đăng nhập bằng tài khoản ReCo</small>
            </div>
            <Form role="form" onSubmit={handleSubmit(login, onError)}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username"
                    type="text"
                    {...register("username")}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    {...register("password")}
                  />
                </InputGroup>
              </FormGroup>
              {errorMsg && (
                <div className="text-muted">
                  <span style={{ color: "#f5365c" }}>{errorMsg}</span>
                </div>
              )}
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Đăng nhập
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Quên mật khẩu</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <Link href="/register">
              <a className="text-light" href="#">
                <small>Tạo tài khoản</small>
              </a>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
}

Login.layout = Auth;
Login.title="Đăng Nhập";

export default Login;
