import React, { useEffect, useState } from "react";
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
  FormFeedback
} from "reactstrap";
import { useForm } from "react-hook-form";
import Link from "next/link";
// layout for this page
import Auth from "../layouts/Auth";
import authService from "../services/authService";
import authRoute from "../authRoute";
import Alert from "../components/Alert2";

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({});
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState({});

  const subcribe = (data) => {
    const { username, email, password } = data;
    authService.register(username, email, password).then((res) => {
      if (res.status == "CREATED") {
        Alert.showCustomSccess("Tạo tài khoản thành công! Tài khoản sẽ được hoạt động khi quản trị viên phê duyệt.").then(res => {
          router.push("/login");
        });
      }
      if(res.status == "BAD_REQUEST") {
        console.log("Got error");
        setErrorMsg(res.data);
      }
    });
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Đăng kí tài khoản ReCo</small>
            </div>
            <Form role="form" onSubmit={handleSubmit(subcribe)}>
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
                    {...register("username", {
                      required: true,
                    })}
                    invalid={errors.email ? true : false}
                  />
                  {errors.username && (
                    <FormFeedback>Không được trống.</FormFeedback>
                  )}
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...register("email", {
                      required: true,
                    })}
                    invalid={errors.email ? true : false}
                  />
                  {errors.email && (
                    <FormFeedback>Không được trống.</FormFeedback>
                  )}
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
                    {...register("password", {
                      required: true,
                    })}
                    invalid={errors.password ? true : false}
                  />
                  {errors.password && errors.password.type == "required" && (
                    <FormFeedback>Không được trống.</FormFeedback>
                  )}
                  {errors.password && errors.password.type == "pattern" && (
                    <FormFeedback style={{ display: "block" }}>
                      Mật khẩu tối thiểu 8 kí tự và bao gồm: Chữ hoa, chữ
                      thường, và số.
                    </FormFeedback>
                  )}
                </InputGroup>
              </FormGroup>
              {errorMsg && errorMsg.username && (
                <div className="text-muted">
                  <span style={{ color: "#f5365c" }}>{errorMsg.username}</span>
                </div>
              )}
              {errorMsg && errorMsg.email && (
                <div className="text-muted">
                  <span style={{ color: "#f5365c" }}>{errorMsg.email}</span>
                </div>
              )}
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Đăng kí
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            
          </Col>
          <Col className="text-right" xs="6">
            <Link href="/login">
              <a className="text-light" href="#">
                <small>Đăng nhập</small>
              </a>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
}

Login.layout = Auth;
Login.title="Đăng Kí";

export default Login;
