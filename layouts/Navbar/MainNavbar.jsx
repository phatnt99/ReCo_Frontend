import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Label,
  Row,
  Col,
  FormFeedback,
  Button,
} from "reactstrap";
import authService from "../../services/authService";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Alert from "../../components/Alert2";

const style = {
  label: {
    fontSize: "0.875rem",
    fontWeight: "bold",
  },
};

function ChangePWModal(props) {
  const { modal, setModal } = props;
  const [errorMsg, setErrorMsg] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm();

  const toggle = () => setModal(!modal);

  const changePassword = (data) => {
    const userId = localStorage.getItem("authId");
    const request = {
      ...data,
      userId: userId,
    };

    authService.changePwd(request).then((res) => {
      if (res.status == "OK") {
        localStorage.setItem("auth", res.data.token);
        Alert.showUpdateSuccess();
      } else if (res.status == "BAD_REQUEST") {
        setErrorMsg(res.data);
      } else Alert.showError();
    });
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <Form onSubmit={handleSubmit(changePassword)}>
          <ModalHeader toggle={toggle}>{"Đổi mật khẩu"}</ModalHeader>
          <ModalBody>
            <Card className="border-0">
              <CardBody>
                <FormGroup>
                  <Row>
                    <Col>
                      <Label for="res-general-cuisine" style={style.label}>
                        Mật khẩu hiện tại
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                    </Col>
                    <Col>
                      <input
                        className="form-control"
                        id="res-general-cuisine"
                        {...register("currentPassword", {
                          required: true,
                          //pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                        })}
                      />
                      {errors.currentPassword &&
                        errors.currentPassword.type == "required" && (
                          <FormFeedback style={{ display: "block" }}>
                            Không được trống.
                          </FormFeedback>
                        )}
                      {errors.currentPassword &&
                        errors.currentPassword.type == "pattern" && (
                          <FormFeedback style={{ display: "block" }}>
                            Mật khẩu tối thiểu 8 kí tự và bao gồm: Chữ hoa, chữ
                            thường, số và kí tự đặc biệt
                          </FormFeedback>
                        )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col>
                      <Label for="res-general-cuisine" style={style.label}>
                        Mật khẩu mới
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                    </Col>
                    <Col>
                      <input
                        className="form-control"
                        id="res-general-cuisine"
                        {...register("newPassword", {
                          required: true,
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                        })}
                      />
                      {errors.newPassword &&
                        errors.newPassword.type == "required" && (
                          <FormFeedback style={{ display: "block" }}>
                            Không được trống.
                          </FormFeedback>
                        )}
                      {errors.newPassword &&
                        errors.newPassword.type == "pattern" && (
                          <FormFeedback style={{ display: "block" }}>
                            Mật khẩu tối thiểu 8 kí tự và bao gồm: Chữ hoa, chữ
                            thường, số và kí tự đặc biệt
                          </FormFeedback>
                        )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col>
                      <Label for="res-general-cuisine" style={style.label}>
                        Nhập lại mật khẩu mới
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                    </Col>
                    <Col>
                      <input
                        className="form-control"
                        id="res-general-cuisine"
                        {...register("reNewPassword", {
                          required: true,
                          validate: {
                            matchPassword: (v) => v == getValues("newPassword"),
                          },
                        })}
                      />
                      {errors.reNewPassword &&
                        errors.reNewPassword.type == "required" && (
                          <FormFeedback style={{ display: "block" }}>
                            Không được trống.
                          </FormFeedback>
                        )}
                      {errors.reNewPassword &&
                        errors.reNewPassword.type == "matchPassword" && (
                          <FormFeedback style={{ display: "block" }}>
                            Không khớp với mật khẩu mới.
                          </FormFeedback>
                        )}
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  {errorMsg && <FormFeedback style={{ display: "block" }}>
                    {errorMsg}
                  </FormFeedback>}
                </FormGroup>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" className="btn btn-primary">
              Đổi mật khẩu
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
}

function MainNavbar({ brandText, user }) {
  const router = useRouter();
  const [modal, setModal] = useState();
  const logout = () => {
    authService.logout();
    router.push("/login");
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link href={router.pathname}>
            <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
              {brandText}
            </a>
          </Link>
          {user && (
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      {user.avatar && <img alt="..." src={user.avatar} />}
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {user.fullName}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  {user.role?.name != "ADMIN" && (
                    <>
                      <Link href="/owner/profile">
                        <DropdownItem>
                          <i className="ni ni-single-02" />
                          <span>Cá nhân</span>
                        </DropdownItem>
                      </Link>
                      <Link href="/owner/profile">
                        <DropdownItem onClick={() => setModal(!modal)}>
                          <i className="ni ni-single-02" />
                          <span>Đổi mật khẩu</span>
                        </DropdownItem>
                      </Link>
                      <DropdownItem divider />
                    </>
                  )}
                  <DropdownItem onClick={logout}>
                    <i className="ni ni-user-run" />
                    <span>Đăng xuất</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          )}
        </Container>
      </Navbar>
      <ChangePWModal modal={modal} setModal={setModal} />
    </>
  );
}

export default MainNavbar;
