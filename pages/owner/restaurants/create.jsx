import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Row,
  Button,
  Spinner,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { Col, Form, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { UploadLogo, CarouselBuilder } from "../../../components/Restaurant";
import AlertResult from "../../../components/AlertResult";
import AdminLayout from "../../../layouts/OwnerLayout";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import restaurantService from "../../../services/restaurantService";
import spring from "../../../springRoute";
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

function CreateRestaurant() {
  const [creating, setCreating] = useState(false);
  const [restaurant, setRestaurant] = useState({
    carousel: [],
    menu: [],
    payment: [],
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const [response, setResponse] = useState({});
  // Data fetching
  const ownerQuery = `${spring.owner}`;
  const { data: tags } = useSWR(`${spring.resource}/tags`);
  const { data: districts } = useSWR(spring.resource);
  const { data: owners } = useSWR(ownerQuery);

  if (!tags || !districts || !owners)
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
            <CardHeader className="border-0">
              <Row>
                <Col>
                  <h3 className="mb-0 text-uppercase">th??m nh?? h??ng</h3>
                </Col>
                <Col className="d-flex justify-content-end"></Col>
              </Row>
            </CardHeader>
            <Form>
              <CardBody>
                <Spinner type="grow" color="primary" />
              </CardBody>
            </Form>
          </Card>
        </Container>
      </>
    );
  const tagElement = [];
  tags.forEach((tag) => {
    tagElement.push(
      <option value={tag.tag.id}>
        {tag.tag.name}({tag.countTag})
      </option>
    );
  });

  const districtElement = [];
  districts[0].child.forEach((district) => {
    districtElement.push(<option value={district.id}>{district.name}</option>);
  });

  const ownerElement = [];
  ownerElement.push(<option value={null}>{"None"}</option>);
  owners.content.forEach((owner) => {
    ownerElement.push(<option value={owner.id}>{owner.fullName}</option>);
  });

  const create = (data) => {
    // validate
    setCreating(true);
    const { payment, ...formModel } = data;
    let dd = Object.assign(restaurant, formModel);
    const ownerId = localStorage.getItem("authId");

    dd = {
      ...dd,
      ownerId: ownerId,
    };

    if (dd.district == undefined) dd.district = 7;

    console.log(dd);

    // post data request
    restaurantService.create(dd).then((response) => {
      console.log(response);
      setCreating(false);
      if (response.status == "CREATED") {
        mlService.updateRestaurantDistance(response.data.id);
        Alert.showCreateSuccess();
        reset();
      } else Alert.showError();
    });
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
          <CardHeader className="border-0">
            <Row>
              <Col>
                <h3 className="mb-0 text-uppercase">th??m nh?? h??ng</h3>
              </Col>
              <Col className="d-flex justify-content-end"></Col>
            </Row>
          </CardHeader>
          <Form onSubmit={handleSubmit(create)}>
            <CardBody>
              <FormGroup row>
                <Label for="res-name" sm={2} style={style.label}>
                  T??n c???a h??ng
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    id="res-name"
                    {...register("name", {
                      required: true,
                      validate: (v) => v.trim() != "",
                    })}
                    invalid={errors.name ? true : false}
                  />
                  {errors.name && (
                    <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="res-introduction" sm={2} style={style.label}>
                  Gi???i thi???u
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm={10}>
                  <Input
                    type="textarea"
                    id="res-introduction"
                    {...register("introduction", {
                      required: true,
                      validate: (v) => v.trim() != "",
                    })}
                    invalid={errors.introduction ? true : false}
                  />
                  {errors.name && (
                    <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
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
                    setRestaurant({ ...restaurant, tags: updateTags });
                  }}
                >
                  {tagElement}
                </Input>
                {errors.tagz && (
                  <FormFeedback>Tags kh??ng ???????c ????? tr???ng!</FormFeedback>
                )}
              </FormGroup>
              <>
                <h6 className="heading-small text-muted mb-4">T???ng quan</h6>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-general-cuisine" style={style.label}>
                        ???m th???c
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="textarea"
                        id="res-general-cuisine"
                        {...register("cuisine", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        invalid={errors.cuisine ? true : false}
                      />
                      {errors.cuisine && (
                        <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-general-space" style={style.label}>
                        Kh??ng gian
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="textarea"
                        id="res-general-space"
                        {...register("space", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        invalid={errors.space ? true : false}
                      />
                      {errors.space && (
                        <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-general-suitable" style={style.label}>
                        Lo???i h??nh
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="textarea"
                        id="res-general-suitable"
                        {...register("suitable", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        invalid={errors.suitable ? true : false}
                      />
                      {errors.suitable && (
                        <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-general-parking" style={style.label}>
                        ????? xe
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="textarea"
                        id="res-general-parking"
                        {...register("parking", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        invalid={errors.parking ? true : false}
                      />
                      {errors.parking && (
                        <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">
                  Th???i gian ho???t ?????ng
                </h6>
                <Row form>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="res-time-open" style={style.label}>
                        Chi ti???t
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="res-time-open"
                        {...register("openTime", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        invalid={errors.openTime ? true : false}
                      />
                      {errors.openTime && (
                        <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">M???c gi??</h6>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="res-price-from" style={style.label}>
                        Gi?? th???p nh???t
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Input
                          style={style.inputLeft}
                          type="text"
                          id="res-price-from"
                          {...register("minPrice", {
                            required: true,
                            pattern: /[0-9]/,
                            validate: {
                              notEmpty: (v) => v.trim() != "",
                              //validPrice: v => v <= getValues("maxPrice")
                            },
                          })}
                          invalid={errors.minPrice ? true : false}
                        />
                        <InputGroupText style={style.inputRight}>
                          VND
                        </InputGroupText>
                      </div>
                      {errors.minPrice &&
                        errors.minPrice.type == "required" && (
                          <FormFeedback style={{ display: "block" }}>
                            Kh??ng ???????c tr???ng.
                          </FormFeedback>
                        )}
                      {errors.minPrice &&
                        errors.minPrice.type == "validPrice" && (
                          <FormFeedback style={{ display: "block" }}>
                            Kh??ng l???n h??n Gi?? cao nh???t.
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="res-price-to" style={style.label}>
                        Gi?? cao nh???t
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Input
                          style={style.inputLeft}
                          type="text"
                          id="res-price-to"
                          {...register("maxPrice", {
                            required: true,
                            pattern: /[0-9]/,
                            validate: {
                              notEmpty: (v) => v.trim() != "",
                              //validPrice: v => v >= getValues("minPrice")
                            },
                          })}
                          invalid={errors.maxPrice ? true : false}
                        />
                        <InputGroupText style={style.inputRight}>
                          VND
                        </InputGroupText>
                      </div>
                      {errors.maxPrice &&
                        errors.maxPrice.type == "required" && (
                          <FormFeedback style={{ display: "block" }}>
                            Kh??ng ???????c tr???ng.{" "}
                          </FormFeedback>
                        )}
                      {errors.maxPrice &&
                        errors.maxPrice.type == "validPrice" && (
                          <FormFeedback style={{ display: "block" }}>
                            Kh??ng nh??? h??n Gi?? th???p nh???t.
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <Label for="res-price-payment" style={style.label}>
                      Ph????ng th???c thanh to??n
                    </Label>
                    <FormGroup row>
                      <Col sm={10}>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              id="res-price-payment"
                              value="Ti???n m???t"
                              {...register("payment.0")}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRestaurant({
                                    ...restaurant,
                                    payment: [
                                      ...restaurant.payment,
                                      "Ti???n m???t",
                                    ],
                                  });
                                } else {
                                  setRestaurant({
                                    ...restaurant,
                                    payment: restaurant.payment.filter(
                                      (p) => p != "Ti???n m???t"
                                    ),
                                  });
                                }
                              }}
                            />
                            Ti???n m???t
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              id="res-price-payment"
                              value="Visa/Master Card"
                              {...register("payment.1")}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRestaurant({
                                    ...restaurant,
                                    payment: [
                                      ...restaurant.payment,
                                      "Visa/Master Card",
                                    ],
                                  });
                                } else {
                                  setRestaurant({
                                    ...restaurant,
                                    payment: restaurant.payment.filter(
                                      (p) => p != "Visa/Master Card"
                                    ),
                                  });
                                }
                              }}
                            />
                            Visa / Master card
                          </Label>
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">?????a ch???</h6>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-address-district" style={style.label}>
                        Qu???n
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
                        ?????a ch???
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="res-address-info"
                        {...register("address", {
                          required: true,
                          validate: (v) => v.trim() != "",
                        })}
                        invalid={errors.address ? true : false}
                      />
                      {errors.address && (
                        <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-address-long" style={style.label}>
                        Longtitude
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="res-address-long"
                        {...register("longtitude", {
                          required: true,
                          pattern: /[0-9\.]+$/,
                          validate: (v) => v.trim() != "",
                        })}
                        invalid={errors.longtitude ? true : false}
                      />
                      {errors.longtitude && (
                        <FormFeedback>Sai ?????nh d???ng.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="res-address-la" style={style.label}>
                        Latitude
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="res-address-la"
                        {...register("latitude", {
                          required: true,
                          pattern: /[0-9\.]+$/,
                          validate: (v) => v.trim() != "",
                        })}
                        invalid={errors.latitude ? true : false}
                      />
                      {errors.latitude && (
                        <FormFeedback>Sai ?????nh d???ng.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">H??nh ???nh</h6>
                <Row form>
                  <Col sm={12}>
                    <FormGroup row>
                      <Label for="res-logo" style={style.label} sm={2}>
                        Logo
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <div className="col-sm-10">
                        <UploadLogo model={restaurant} method={setRestaurant} />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm={12}>
                    <FormGroup row>
                      <Label for="res-carousel" style={style.label} sm={2}>
                        ???nh th???c t???
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <div className="col-sm-10">
                        <CarouselBuilder
                          model={restaurant}
                          method={setRestaurant}
                          type="carousel"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm={12}>
                    <FormGroup row>
                      <Label for="res-logo" style={style.label} sm={2}>
                        ???nh th???c ????n (menu)
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <div className="col-sm-10">
                        <CarouselBuilder
                          model={restaurant}
                          method={setRestaurant}
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
                  {response.name && (
                    <AlertResult
                      resultType={"SUCCESS"}
                      message={`${response.name} ???????c th??m th??nh c??ng!`}
                    />
                  )}
                </Col>
                <Col className="d-flex justify-content-end">
                  {!creating && (
                    <Button color="primary" type="submit">
                      Th??m nh?? h??ng
                    </Button>
                  )}
                  {creating && (
                    <Button color="primary" type="" disabled={true}>
                      ??ang x??? l??
                    </Button>
                  )}
                </Col>
              </Row>
            </CardFooter>
          </Form>
        </Card>
      </Container>
    </>
  );
}

CreateRestaurant.layout = AdminLayout;
CreateRestaurant.title = "Nh?? H??ng";

export default CreateRestaurant;
