import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import spring from "../../springRoute";
import routes from "../../routes";
import { useDropzone } from "react-dropzone";
import Loading from "../../components/Loading";
import {
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
} from "reactstrap";
import { useForm } from "react-hook-form";
import AdminLayout from "../../layouts/AdminLayout";
import Alert from "../../components/Alert2";
import VoucherService from "../../services/voucherService";

const style = {
  label: {
    fontSize: "0.875rem",
    fontWeight: "bold",
  },
};

function UploadImage({ model, method }) {
  console.log("logo " + model.logoUrl);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      let imageLogo = acceptedFiles.find((image) => image !== undefined);
      if (imageLogo === undefined) return;
      let seletedImage = Object.assign(imageLogo, {
        preview: URL.createObjectURL(imageLogo),
      });
      method({ ...model, logo: seletedImage });
    },
  });

  return (
    <Row>
      <Col>
        <div
          {...getRootProps({ className: "dropzone" })}
          style={{
            position: "relative",
            height: "200px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: ".375rem",
            }}
          >
            {(model.logo || model.logoUrl) && (
              <img
                src={model.logo?.preview ?? model.logoUrl}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </div>
          <input {...getInputProps()} />
          <p>Th??? ???nh v??o ????y ho???c nh???n ????? ch???n ???nh</p>
        </div>
      </Col>
    </Row>
  );
}

function VoucherEdit() {
  // holder for image
  const [model, setModel] = useState({});
  const { data: restaurant } = useSWR(`${spring.restaurant}/all`);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm();

  // Only tag and payment is owned by state
  // Append logo, carousel and menu file

  if (!restaurant) return <Loading />;

  const restaurantEl = [];
  restaurant.forEach((res) => {
    restaurantEl.push(<option value={res.id}>{res.name}</option>);
  });

  const create = (updateForm) => {
    // first check if change image
    let newImg = "";
    if (model.logo) {
      // get new url
      VoucherService.getNewImage(model.logo).then((res) => {
        console.log("new image url = " + res.data);
        newImg = res.data;
        // detach old image
        let requestData = updateForm;
        //binding original data to new object
        requestData = {
          ...requestData,
          image: newImg,
        };
        console.log("FINAL");
        console.log(requestData);

        VoucherService.create(requestData).then((response) => {
          Alert.showCreateSuccess();
          setModel({});
          reset();
        });
      });
      return;
    }

    let requestData = updateForm;
    requestData = {
      ...requestData,
      image: newImg,
    };

    console.log("FINAL");
    console.log(requestData);

    VoucherService.create(requestData).then((response) => {
      console.log(response);
      Alert.showCreateSuccess();
      reset();
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
                <h3 className="mb-0 text-uppercase">th??m khuy???n m??i</h3>
              </Col>
              <Col className="d-flex justify-content-end"></Col>
            </Row>
          </CardHeader>
          <Form onSubmit={handleSubmit(create)}>
            <CardBody>
              <FormGroup row>
                <Label for="res-name" sm={2} style={style.label}>
                  Ti??u ?????
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    id="v-title"
                    className="form-control"
                    {...register("title", {
                      required: true,
                    })}
                    invalid={errors.title}
                  />
                  {errors.title && (
                    <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="res-name" sm={2} style={style.label}>
                  Code
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    id="v-code"
                    className="form-control"
                    {...register("code", {
                      required: true,
                    })}
                    invalid={errors.code}
                  />
                  {errors.code && (
                    <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="v-restaurant" sm={2} style={style.label}>
                  Nh?? h??ng
                </Label>
                <Col sm={10}>
                  <select
                    type="select"
                    id="restaurantId"
                    className="form-control"
                    {...register("restaurantId")}
                  >
                    {restaurantEl}
                  </select>
                </Col>
              </FormGroup>
              <>
                <h6 className="heading-small text-muted mb-4">Th???i gian</h6>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="res-price-from" style={style.label}>
                        T??? ng??y
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        id="fromTime"
                        type="date"
                        className="form-control"
                        {...register("fromTime", {
                          required: true,
                          validate: {
                            validDate: v => new Date(v).getTime() <= new Date(getValues("toTime")).getTime()
                          }
                        })}
                        invalid={errors.fromTime}
                      />
                      {errors.fromTime && errors.fromTime.type == "required" && (
                        <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                      )}
                      {errors.fromTime && errors.fromTime.type == "validDate" && (
                        <FormFeedback>Kh??ng ???????c sau ?????n ng??y.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="res-price-to" style={style.label}>
                        ?????n ng??y
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        id="toTime"
                        type="date"
                        className="form-control"
                        {...register("toTime", {
                          required: true,
                          validate: {
                            validDate: v => new Date(v).getTime() >= new Date(getValues("fromTime")).getTime()
                          }
                        })}
                        invalid={errors.toTime}
                      />
                      {errors.toTime && errors.toTime.type == "required" && (
                        <FormFeedback>Kh??ng ???????c tr???ng.</FormFeedback>
                      )}
                      {errors.toTime && errors.toTime.type == "validDate" && (
                        <FormFeedback>Kh??ng ???????c tr?????c T??? ng??y.</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}></Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">
                  H??nh ???nh<span style={{ color: "red" }}>*</span>
                </h6>
                <UploadImage model={model} method={setModel} />
              </>
            </CardBody>
            <CardFooter className="border-0">
              <Row>
                <Col></Col>
                <Col className="d-flex justify-content-end">
                  <Button color="primary" type="submit">
                    Th??m voucher
                  </Button>
                </Col>
              </Row>
            </CardFooter>
          </Form>
        </Card>
      </Container>
    </>
  );
}
VoucherEdit.layout = AdminLayout;
VoucherEdit.title="Khuy???n M??i";

export default VoucherEdit;
