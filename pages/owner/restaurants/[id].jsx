import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import spring from "../../../springRoute";
import routes from "../../../routes";
import { UploadLogo, CarouselBuilder } from "../../../components/Restaurant";
import {
  Badge,
  Container,
  Row,
  Card,
  Form,
  CardBody,
  FormGroup,
  Label,
  Col,
  Input,
  FormFeedback,
  CardFooter,
  Button,
  CardHeader,
  Spinner,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/OwnerLayout";
import ConfirmModal from "../../../components/ConfirmModal";
import restaurantService from "../../../services/restaurantService";
import mlService from "../../../services/mlService";
import Alert from "../../../components/Alert2";

const style = {
  label: {
    fontSize: "0.875rem",
    fontWeight: "bold",
  },
  inputLeft: {
    margin: "-1px",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputRight: {
    margin: "-1px",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
};

function BuildApprove({ model, action }) {
  if (model?.approveStatus == 1) {
    // waiting for approve
    return (
      <>
        <Button
          className="btn"
          color="success"
          type="button"
          onClick={() => action(2)}
        >
          <i
            className="fas fa-thumbs-up"
            style={{ color: "white", paddingRight: "0.5rem" }}
          ></i>
          Duyệt
        </Button>
        <Button
          className="btn"
          color="default"
          type="button"
          onClick={() => action(3)}
        >
          <i
            className="fas fa-thumbs-down"
            style={{ color: "white", paddingRight: "0.5rem" }}
          ></i>
          Từ chối
        </Button>
      </>
    );
  }

  if (model?.approveStatus == 2) {
    // restaurant has been approved
    return (
      <Button
        className="btn"
        color="danger"
        type="button"
        onClick={() => action(3)}
      >
        <i
          className="fas fa-lock"
          style={{ color: "white", paddingRight: "0.5rem" }}
        ></i>
        Khóa
      </Button>
    );
  }

  return (
    <Button
      className="btn"
      color="primary"
      type="button"
      onClick={() => action(2)}
    >
      <i
        className="fas fa-lock-open"
        style={{ color: "white", paddingRight: "0.5rem" }}
      ></i>
      Mở khóa
    </Button>
  );
}

function RestaurantEdit() {
  //triger one time loading
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState({
    tags: [],
    logo: null,
    menu: [],
    carousel: [],
    logoUrl: "",
    carouselUrl: "",
    menuUrl: "",
    payment: [],
    approveStatus: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const url = `${spring.restaurantEdit}/${id}`;
  const { data, error: fail } = useSWR(url);
  const { data: tags } = useSWR(`${spring.resource}/tags`);
  const { data: districts } = useSWR(spring.resource);
  const ownerQuery = `${spring.owner}`;
  const { data: owners } = useSWR(ownerQuery);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  // Only tag and payment is owned by state
  // Append logo, carousel and menu file
  useEffect(() => {
    console.log("Cập nhật lại");
    console.log(data);
    if (data) {
      const payments = data.payment.split("&");
      setModel({
        ...model,
        tags: data?.tags, //just ID
        payment: payments, // just array
        logoUrl: data?.logo,
        carouselUrl: data?.carousel,
        menuUrl: data?.menu,
        approveStatus: data?.approveStatus,
      });
    }
  }, [loading]);

  useEffect(() => {
    if (data) setLoading(false);
  }, [data]);

  if (fail) return <div>Something wrong!</div>;

  if (!data || !tags || !districts || !owners)
    return (
      <>
        <div className="header bg-gradient-dark pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row></Row>
            </div>
          </Container>
        </div>
        {/* Body */}
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader className="border-0 mb-1">
              <Row>
                <Col>
                  <h3 className="mb-0 text-uppercase">cập nhật nhà hàng</h3>
                </Col>
                <Col className="d-flex justify-content-end"></Col>
              </Row>
              <Spinner type="grow" color="primary" />
            </CardHeader>
            <Form>
              <CardBody></CardBody>
              <CardFooter className="border-0">
                <Spinner type="grow" color="primary" />
              </CardFooter>
            </Form>
          </Card>
        </Container>
      </>
    );

  const init = () => {
    // load district
    const districtElement = [];
    districts[0].child.forEach((district) => {
      districtElement.push(
        <option value={district.id} selected={data.district === district.id}>
          {district.name}
        </option>
      );
    });

    console.log("DATA DETAIL = ");
    console.log(data);

    const ownerElement = [];
    ownerElement.push(<option value={null}>{"None"}</option>);
    owners.content.forEach((owner) => {
      ownerElement.push(
        <option value={owner.id} selected={data.ownerId == owner.id}>
          {owner.fullName}
        </option>
      );
    });

    // load tag
    const tagElement = [];
    tags.forEach((tag) => {
      tagElement.push(
        <option
          value={tag.tag.id}
          selected={model.tags.find((t) => t == tag.tag.id)}
        >
          {tag.tag.name}({tag.countTag})
        </option>
      );
    });

    return {
      districtElement,
      tagElement,
      ownerElement,
    };
  };

  const { districtElement, tagElement, ownerElement } = init();

  const edit = (updateForm) => {
    console.log("Gi");
    console.log(getValues("minPrice"));
    console.log(getValues("maxPrice"));

    const { payment, tagz, ...formModel } = updateForm;
    // remove undefined data field
    Object.keys(formModel).forEach(
      (key) => formModel[key] === undefined && delete formModel[key]
    );
    //binding original data to new object
    let requestData = {
      ...data,
    };
    //apply new change

    requestData = {
      ...requestData,
      ...formModel,
    };

    // aply new logo, new carousel
    // logo: just send new logo or null
    // for rest, send new file and url old file
    const { logoUrl, ...actualModel } = model;
    const ownerId = localStorage.getItem("authId");
    requestData = {
      ...requestData,
      ...actualModel,
      ownerId: ownerId,
    };
    console.log("FINAL");
    console.log(requestData);

    restaurantService.update(requestData).then((response) => {
      console.log(response);
      if (response.status == "update") {
        // update ML
        //mlService.updateRestaurantDistance(id);
        //
        Alert.showUpdateSuccess();
        mutate(`${spring.restaurantEdit}/${id}`);
        //revalidate();
      } else Alert.showError();
    });
  };

  const deleteOne = () => {
    restaurantService.delete(id).then((res) => {
      if (res.status === "update") {
        // route to restaurants
        Alert.showDeleteSuccess().then(() => {
          router.push(routes.find((r) => r.idx == "restaurant").path);
        });
      } else Alert.showError();
    });
  };

  const approve = (type) => {
    restaurantService.approve(id, type).then((res) => {
      if (res.status == "update") {
        // update successfully!
        setModel({
          ...model,
          approveStatus: type,
        });
        mutate(url);
      }
    });
  };

  const handlePayment = (e, el) => {
    if (e.target.checked) {
      let newOne = model.payment;
      if (!newOne.includes(el)) {
        newOne.push(el);
      }
      setModel({
        ...model,
        payment: newOne,
      });
    } else {
      let newOne = model.payment;
      let idx = newOne.indexOf(el);
      newOne.splice(idx, 1);
      setModel({
        ...model,
        payment: newOne,
      });
    }
    console.log("Payment change: ");
    console.log(model.payment);
  };

  return (
    <>
      <div className="header bg-gradient-dark pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row></Row>
          </div>
        </Container>
      </div>
      {/* Body */}
      <Container className="mt--7" fluid>
        <Card className="shadow">
          <CardHeader className="border-0 mb-1">
            <Row>
              <Col>
                <h3 className="mb-0 text-uppercase">cập nhật nhà hàng</h3>
              </Col>
              <Col className="d-flex justify-content-end"></Col>
            </Row>
            <Row>
              <Col></Col>
              <Col className="d-flex justify-content-end">
                {data.approveStatus == 1 && (
                  <Button variant="outline-secondary" disabled>
                    Đang chờ duyệt
                  </Button>
                )}
                {data.approveStatus == 2 && (
                  <Button variant="outline-secondary" disabled>
                    Đã duyệt
                  </Button>
                )}
                {data.approveStatus == 3 && (
                  <Button variant="outline-secondary" disabled>
                    Đã khóa
                  </Button>
                )}
              </Col>
            </Row>
          </CardHeader>
          <Form onSubmit={handleSubmit(edit, (e) => console.log(e))}>
            <CardBody>
              <FormGroup row>
                <Label for="res-name" sm={2} style={style.label}>
                  Tên cửa hàng
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm={10}>
                  <input
                    type="text"
                    id="res-name"
                    className={
                      errors.name ? "form-control is-invalid" : "form-control"
                    }
                    {...register("name", {
                      required: true,
                      validate: (v) => v.trim() != "",
                    })}
                    defaultValue={data.name}
                  />
                  {errors.name && (
                    <FormFeedback style={{ display: "block" }}>
                      Không để trống.
                    </FormFeedback>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="res-introduction" sm={2} style={style.label}>
                  Giới thiệu
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm={10}>
                  <textarea
                    id="res-introduction"
                    className={
                      errors.introduction
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    {...register("introduction", {
                      required: true,
                      validate: (v) => v.trim() != "",
                    })}
                    defaultValue={data.introduction}
                  />
                  {errors.introduction && (
                    <FormFeedback style={{ display: "block" }}>
                      Không để trống.
                    </FormFeedback>
                  )}
                </Col>
              </FormGroup>
              <FormGroup>
                <Label for="res-tags" style={style.label}>
                  Tags
                </Label>
                <Input
                  type="select"
                  id="res-tags"
                  multiple
                  {...register("tagz")}
                  invalid={errors.tagz ? true : false}
                  onChange={(e) => {
                    let updateTags = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setModel({ ...model, tags: updateTags });
                  }}
                >
                  {tagElement}
                </Input>
                {errors.tagz && (
                  <FormFeedback style={{ display: "block" }}>
                    Tags không được để trống!
                  </FormFeedback>
                )}
              </FormGroup>
              <>
                <h6 className="heading-small text-muted mb-4">Tổng quan</h6>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-general-cuisine" style={style.label}>
                        Ẩm thực
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <textarea
                        id="res-general-cuisine"
                        className={
                          errors.cuisine
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("cuisine", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        defaultValue={data.cuisine}
                      />
                      {errors.cuisine && (
                        <FormFeedback style={{ display: "block" }}>
                          Không được trống.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-general-space" style={style.label}>
                        Không gian
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <textarea
                        id="res-general-space"
                        className={
                          errors.space
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("space", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        defaultValue={data.space}
                        invalid={errors.space ? true : false}
                      />
                      {errors.space && (
                        <FormFeedback style={{ display: "block" }}>
                          Không được trống.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-general-suitable" style={style.label}>
                        Loại hình
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <textarea
                        id="res-general-suitable"
                        className={
                          errors.suitable
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("suitable", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        defaultValue={data.suitable}
                        invalid={errors.suitable ? true : false}
                      />
                      {errors.suitable && (
                        <FormFeedback style={{ display: "block" }}>
                          Không được trống.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-general-parking" style={style.label}>
                        Đỗ xe
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <textarea
                        id="res-general-parking"
                        className={
                          errors.parking
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("parking", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        defaultValue={data.parking}
                        invalid={errors.parking ? true : false}
                      />
                      {errors.parking && (
                        <FormFeedback style={{ display: "block" }}>
                          Không được trống.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">
                  Thời gian hoạt động
                </h6>
                <Row form>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="res-time-open" style={style.label}>
                        Chi tiết
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <input
                        type="text"
                        id="res-time-open"
                        className={
                          errors.openTime
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("openTime", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        defaultValue={data.openTime}
                        invalid={errors.openTime ? true : false}
                      />
                      {errors.openTime && (
                        <FormFeedback style={{ display: "block" }}>
                          Không được trống.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">Mức giá</h6>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="res-price-from" style={style.label}>
                        Giá thấp nhất
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <input
                          style={style.inputLeft}
                          type="number"
                          id="res-price-from"
                          className={
                            errors.minPrice
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          {...register("minPrice", {
                            required: true,
                            validate: {
                              notEmpty: (v) => v.trim() != "",
                              validPrice: (v) =>
                                parseInt(v) <= parseInt(getValues("maxPrice")),
                            },
                          })}
                          defaultValue={data.minPrice}
                          invalid={errors.minPrice ? true : false}
                        />
                        <InputGroupText style={style.inputRight}>
                          VND
                        </InputGroupText>
                      </div>
                      {errors.minPrice &&
                        errors.minPrice.type == "required" && (
                          <FormFeedback style={{ display: "block" }}>
                            Không được trống.
                          </FormFeedback>
                        )}
                      {errors.minPrice &&
                        errors.minPrice.type == "validPrice" && (
                          <FormFeedback style={{ display: "block" }}>
                            Không lớn hơn Giá cao nhất.
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="res-price-to" style={style.label}>
                        Giá cao nhất
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <input
                          style={style.inputLeft}
                          type="number"
                          id="res-price-to"
                          className={
                            errors.maxPrice
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          {...register("maxPrice", {
                            required: true,
                            validate: {
                              notEmpty: v => v.trim() != "",
                              validPrice: v => parseInt(v) >= parseInt(getValues("minPrice"))
                            }
                          })}
                          defaultValue={data.maxPrice}
                          invalid={errors.maxPrice ? true : false}
                        />
                        <InputGroupText style={style.inputRight}>
                          VND
                        </InputGroupText>
                      </div>
                      {errors.maxPrice &&
                        errors.maxPrice.type == "required" && (
                          <FormFeedback style={{ display: "block" }}>
                            Không được trống.{" "}
                          </FormFeedback>
                        )}
                      {errors.maxPrice &&
                        errors.maxPrice.type == "validPrice" && (
                          <FormFeedback style={{ display: "block" }}>
                            Không nhỏ hơn Giá thấp nhất.
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <div>
                      <Label for="res-price-payment" style={style.label}>
                        Phương thức thanh toán
                      </Label>
                      <FormGroup row>
                        <Col sm={10}>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                id="res-price-payment"
                                value="Tiền mặt"
                                {...register("payment.0")}
                                defaultChecked={model.payment.find(
                                  (p) => p == "Tiền mặt"
                                )}
                                onChange={(e) => handlePayment(e, "Tiền mặt")}
                              />
                              Tiền mặt
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                id="res-price-payment"
                                value="Visa / Master card"
                                {...register("payment.1")}
                                defaultChecked={model.payment.find(
                                  (p) => p == "Visa / Master card"
                                )}
                                onChange={(e) =>
                                  handlePayment(e, "Visa / Master card")
                                }
                              />
                              Visa / Master card
                            </Label>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                    </div>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">Địa chỉ</h6>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-address-district" style={style.label}>
                        Quận
                      </Label>
                      <Input
                        type="select"
                        id="res-address-district"
                        {...register("district")}
                      >
                        {districtElement}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-address-info" style={style.label}>
                        Địa chỉ
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <input
                        type="text"
                        id="res-address-info"
                        className={
                          errors.address
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("address", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        defaultValue={data.address}
                        invalid={errors.address ? true : false}
                      />
                      {errors.address && (
                        <FormFeedback style={{ display: "block" }}>
                          Không được trống.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-address-long" style={style.label}>
                        Longtitude
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <input
                        type="text"
                        id="res-address-long"
                        className={
                          errors.longtitude
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("longtitude", {
                          required: true,
                          pattern: /[0-9\.]+$/,
                          validate: (v) => v.trim() != "",
                        })}
                        defaultValue={data.longtitude}
                        invalid={errors.longtitude ? true : false}
                      />
                      {errors.longtitude && (
                        <FormFeedback style={{ display: "block" }}>
                          Sai định dạng.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-address-la" style={style.label}>
                        Latitude
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <input
                        type="text"
                        id="res-address-la"
                        className={
                          errors.latitude
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("latitude", {
                          required: true,
                          pattern: /[0-9\.]+$/,
                          validate: (v) => v.trim() != "",
                        })}
                        defaultValue={data.latitude}
                        invalid={errors.latitude ? true : false}
                      />
                      {errors.latitude && (
                        <FormFeedback style={{ display: "block" }}>
                          Sai định dạng.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">Hình ảnh</h6>
                <Row form>
                  <Col sm={12}>
                    <FormGroup row>
                      <Label for="res-logo" style={style.label} sm={2}>
                        Logo
                      </Label>
                      <div className="col-sm-10">
                        <UploadLogo model={model} method={setModel} />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm={12}>
                    <FormGroup row>
                      <Label for="res-carousel" style={style.label} sm={2}>
                        Ảnh thực tế
                      </Label>
                      <div className="col-sm-10">
                        <CarouselBuilder
                          model={model}
                          method={setModel}
                          type="carousel"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm={12}>
                    <FormGroup row>
                      <Label for="res-logo" style={style.label} sm={2}>
                        Ảnh thực đơn (menu)
                      </Label>
                      <div className="col-sm-10">
                        <CarouselBuilder
                          model={model}
                          method={setModel}
                          type="menu"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </>
            </CardBody>
            <CardFooter className="border-0">
              <Row>
                <Col>
                  <Button
                    color="danger"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    Xóa
                  </Button>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button color="primary" type="submit">
                    Lưu thay đổi
                  </Button>
                </Col>
              </Row>
            </CardFooter>
          </Form>
        </Card>
      </Container>
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        buttonLabel={"Xóa"}
        title={"Xóa nhà hàng"}
        handleAction={() => deleteOne()}
        message={"Xác nhận xóa nhà hàng?"}
      />
    </>
  );
}
RestaurantEdit.layout = AdminLayout;
RestaurantEdit.title="Nhà Hàng";

export default RestaurantEdit;
