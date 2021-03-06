import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import spring from "../../../springRoute";
import routes from "../../../routes";
import { useDropzone } from "react-dropzone";
import Loading from "../../../components/Loading";
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
  Spinner,
} from "reactstrap";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/OwnerLayout";
import ConfirmModal from "../../../components/ConfirmModal";
import restaurantService from "../../../services/restaurantService";
import mlService from "../../../services/mlService";
import VoucherService from "../../../services/voucherService";
import Alert from "../../../components/Alert2";

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
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = router.query;
  const { data: voucher, error: fail } = useSWR(`${spring.voucher}/${id}`);
  const ownerId = localStorage.getItem("authId");
  const { data: restaurant } = useSWR(
    `${spring.restaurant}/all/owner/${ownerId}`
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  // Only tag and payment is owned by state
  // Append logo, carousel and menu file

  if (fail) return <div>Something wrong!</div>;

  useEffect(() => {
    if (voucher) {
      setModel({
        ...model,
        logoUrl: voucher.image,
      });
    }
  }, [voucher]);

  if (!voucher || !restaurant)
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
                  <h3 className="mb-0 text-uppercase">c???p nh???t khuy???n m??i</h3>
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

  const restaurantEl = [];
  restaurant.forEach((res) => {
    restaurantEl.push(
      <option value={res.id} selected={res.id == voucher.restaurant.id}>
        {res.name}
      </option>
    );
  });

  const edit = (updateForm) => {
    // first check if change image
    let newImg = voucher.image;
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
          id: id,
          image: newImg,
        };
        console.log("FINAL");
        console.log(requestData);

        VoucherService.update(requestData).then((response) => {
          console.log(response);
          Alert.showUpdateSuccess();
          mutate(`${spring.voucher}/${id}`);
        });
      });
      return;
    }

    let requestData = updateForm;
    requestData = {
      ...requestData,
      id: id,
      image: newImg,
    };

    console.log("FINAL");
    console.log(requestData);

    VoucherService.update(requestData).then((response) => {
      console.log(response);
      Alert.showUpdateSuccess();
      mutate(`${spring.voucher}/${id}`);
    });
  };

  const deleteOne = () => {
    VoucherService.bulkDelete([id]).then((res) => {
      if (res.status === "update") {
        // route to vouchers
        Alert.showDeleteSuccess().then(() => {
          router.push(routes.find((r) => r.idx == "voucher").path);
        });
      }
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
                <h3 className="mb-0 text-uppercase">c???p nh???t khuy???n m??i</h3>
              </Col>
              <Col className="d-flex justify-content-end">
                <ConfirmModal
                  buttonLabel={"X??a"}
                  title={"X??a nh?? h??ng"}
                  handleAction={() => deleteOne()}
                  message={"B???n x??c nh???n mu???n x??a voucher n??y?"}
                />
              </Col>
            </Row>
          </CardHeader>
          <Form onSubmit={handleSubmit(edit)}>
            <CardBody>
              <FormGroup row>
                <Label for="res-name" sm={2} style={style.label}>
                  Ti??u ?????
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm={10}>
                  <input
                    type="text"
                    id="title"
                    className={
                      errors.title ? "form-control is-invalid" : "form-control"
                    }
                    {...register("title", {
                      required: true,
                    })}
                    defaultValue={voucher.title}
                  />
                  {errors.title && (
                    <FormFeedback style={{ display: "block" }}>
                      Kh??ng ????? tr???ng.
                    </FormFeedback>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="res-name" sm={2} style={style.label}>
                  Code
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm={10}>
                  <input
                    type="text"
                    id="v-code"
                    className={
                      errors.code ? "form-control is-invalid" : "form-control"
                    }
                    {...register("code", {
                      required: true,
                    })}
                    defaultValue={voucher.code}
                  />
                  {errors.code && (
                    <FormFeedback style={{ display: "block" }}>
                      Kh??ng ???????c tr???ng.
                    </FormFeedback>
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
                      <input
                        id="fromTime"
                        type="date"
                        defaultValue={voucher.fromTime}
                        className={
                          errors.fromTime
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("fromTime", {
                          required: true,
                          validate: {
                            validDate: (v) =>
                              new Date(v).getTime() <=
                              new Date(getValues("toTime")).getTime(),
                          },
                        })}
                      />
                      {errors.fromTime &&
                        errors.fromTime.type == "required" && (
                          <FormFeedback style={{ display: "block" }}>
                            Kh??ng ???????c tr???ng.
                          </FormFeedback>
                        )}
                      {errors.fromTime &&
                        errors.fromTime.type == "validDate" && (
                          <FormFeedback style={{ display: "block" }}>
                            Kh??ng ???????c sau ?????n ng??y.
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="res-price-to" style={style.label}>
                        ?????n ng??y
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <input
                        id="toTime"
                        type="date"
                        defaultValue={voucher.toTime}
                        className={
                          errors.toTime
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        {...register("toTime", {
                          required: true,
                          validate: {
                            validDate: (v) =>
                              new Date(v).getTime() >=
                              new Date(getValues("fromTime")).getTime(),
                          },
                        })}
                      />
                      {errors.toTime && errors.toTime.type == "required" && (
                        <FormFeedback style={{ display: "block" }}>
                          Kh??ng ???????c tr???ng.
                        </FormFeedback>
                      )}
                      {errors.toTime && errors.toTime.type == "validDate" && (
                        <FormFeedback style={{ display: "block" }}>
                          Kh??ng ???????c tr?????c T??? ng??y.
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="res-price-to" style={style.label}>
                        T??nh tr???ng
                      </Label>
                      {new Date(voucher.toTime).getTime() >=
                      new Date().getTime() ? (
                        <p>??ang di???n ra</p>
                      ) : (
                        <p>H???t h???n</p>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </>
              <>
                <h6 className="heading-small text-muted mb-4">H??nh ???nh</h6>
                <UploadImage model={model} method={setModel} />
              </>
            </CardBody>
            <CardFooter className="border-0">
              <Row>
                <Col>
                  <Button
                    color="danger"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    X??a
                  </Button>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button color="primary" type="submit">
                    L??u thay ?????i
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
        buttonLabel={"X??a"}
        title={"X??a khuy???n m??i"}
        handleAction={() => deleteOne()}
        message={"X??c nh???n x??a khuy???n m??i?"}
      />
    </>
  );
}
VoucherEdit.layout = AdminLayout;
VoucherEdit.title="Khuy???n M??i";

export default VoucherEdit;
