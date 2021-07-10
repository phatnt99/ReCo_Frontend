import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Carousel,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  Col,
  Container,
  Row,
  Table,
  Spinner,
} from "reactstrap";
import useSWR, { mutate } from "swr";
import AdminLayout from "../../layouts/AdminLayout";
import reviewService from "../../services/reviewService";
import spring from "../../springRoute";
import ConfirmModel from "../../components/ConfirmModal";
import Alert from "../../components/Alert2";
import routes from "../../routes";
import Link from "next/link";

function Tag({ tags }) {
  const renderTags = [];
  tags.forEach((tag) =>
    renderTags.push(
      <Badge color="primary" style={{ margin: "0 0.2rem 0 0.2rem" }}>
        {tag.name}
      </Badge>
    )
  );
  return (
    <p>
      <span style={{ fontWeight: "bold" }}>Thẻ: </span> {renderTags}
    </p>
  );
}

function ImageList({ items, type }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item}
      >
        <img
          src={item}
          alt={item.altText}
          style={{ width: "100%", objectFit: "cover", height: "300px" }}
        />
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
}

function Infor({ restaurant }) {
  return (
    <Row>
      <Col>
        <p>Giới thiệu:</p>
        {restaurant.introduction}
        <p>Thông tin thêm:</p>
        <Table bordered>
          <tbody>
            <tr>
              <td>Loại hình</td>
              <td>{restaurant.suitable}</td>
            </tr>
            <tr>
              <td>Đặc trưng</td>
              <td>{restaurant.cuisine}</td>
            </tr>
            <tr>
              <td>Không gian</td>
              <td>{restaurant.space}</td>
            </tr>
            <tr>
              <td>Bãi đậu xe</td>
              <td>{restaurant.parking}</td>
            </tr>
            <tr>
              <td>Thanh toán</td>
              <td>{restaurant.payment}</td>
            </tr>
          </tbody>
        </Table>
        <p>Địa chỉ</p>
        <Table bordered>
          <tbody>
            <tr>
              <td>Tung độ</td>
              <td>{restaurant.address.longtitude}</td>
            </tr>
            <tr>
              <td>Hoành độ</td>
              <td>{restaurant.address.latitude}</td>
            </tr>
            <tr>
              <td>Chi tiết</td>
              <td>{restaurant.address.detail}</td>
            </tr>
          </tbody>
        </Table>
        <p>Thực đơn</p>
        <div
          style={{
            maxWidth: "70%",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          <ImageList items={restaurant.menu.split(";")} type="MENU" />
        </div>
      </Col>
    </Row>
  );
}

function ReviewDetail() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const router = useRouter();
  const { id } = router.query;
  // Data fetching
  const url = `${spring.review}/${id}`;
  const { data: review, error } = useSWR(url);

  console.log("image" + JSON.stringify(review));

  if (!review)
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
          <Row>
            <div className="order-xl-1 col-xl-8">
              <Row style={{ width: "100%" }}>
                <Card
                  className="card-profile shadow"
                  style={{
                    width: "100%",
                    borderTop: "0",
                    borderTopRightRadius: "0",
                    borderTopLeftRadius: "0",
                  }}
                >
                  <Row>
                    <Spinner type="grow" color="primary" />
                  </Row>
                  <CardBody className="pt-0" style={{ marginTop: "20px" }}>
                    <Spinner type="grow" color="primary" />
                  </CardBody>
                </Card>
              </Row>
            </div>
            <div className="order-xl-2 mb-5 mb-xl-0 col-xl-4">
              <Card className="card-profile shadow">
                <Row
                  className="justify-content-center"
                  style={{ marginBottom: "2rem" }}
                >
                  <Spinner type="grow" color="primary" />
                </Row>
                <CardBody className="pt-0 pt-md-4">
                  <Spinner type="grow" color="primary" />
                </CardBody>
              </Card>
              <Card className="card-stats shadow" style={{ marginTop: "2rem" }}>
                <CardBody>
                  <Row style={{ marginBottom: "1rem" }}>
                    <div className="col">
                      <CardTitle
                        className="text-muted mb-0"
                        style={{ textAlign: "justify" }}
                      >
                        Nếu bài viết vi phạm tiêu chuẩn cộng đồng, bạn có thể xóa
                        để ứng dụng văn minh hơn!
                      </CardTitle>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape text-white rounded-circle" style={{ backgroundColor: "orange" }}>
                        <i className="fas fa-exclamation"></i>
                      </div>
                    </Col>
                  </Row>
                  <Spinner type="grow" color="primary" />
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );


  const handleDelete = () => {
    reviewService.delete(id).then((res) => {
      // update successfully!
      if (res.status == "update") {
        Alert.showDeleteSuccess().then(() => {
          router.push(routes.find((r) => r.idx == "review").path);
        })
      } else Alert.showError();
    });
  }

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
        <Row>
          <div className="order-xl-1 col-xl-8">
            <Row style={{ width: "100%" }}>
              <Card
                className="card-profile shadow"
                style={{
                  width: "100%",
                  borderTop: "0",
                  borderTopRightRadius: "0",
                  borderTopLeftRadius: "0",
                }}
              >
                <Row>
                  <Col>
                    <ImageList
                      items={review.listPhoto
                        .replace("[", "")
                        .replace("]", "")
                        .split(",")}
                      type="CAROUSEL"
                    /></Col>
                </Row>
                <CardBody className="pt-0" style={{ marginTop: "20px" }}>
                  <h5 className="h3">{review.title}</h5>
                  <Row className="align-items-center">
                    <Col className="col-auto">
                      <a
                        className="avatar avatar-xl rounded-circle"
                        href="javascript:;"
                      >
                        <img alt="..." src={review.user.avatar}></img>
                      </a>
                    </Col>
                    <div className="col ml-2">
                      <h4 className="mb-0">
                        <Link href={"/diners/" + review.user.id}>{review.user.fullName}</Link>
                      </h4>
                      <p className="text-sm text-muted mb-0">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Col className="col-auto">
                      <span
                        className="heading"
                        style={{
                          color: "orange",
                          marginRight: "10px",
                          fontSize: "1.1rem",
                        }}
                      >
                        {review.point}
                      </span>
                      <i
                        className="fas fa-star"
                        style={{ color: "orange" }}
                      ></i>
                    </Col>
                  </Row>
                  <Row>
                    <p
                      className="description"
                      style={{ margin: "1rem", textAlign: "justify" }}
                    >
                      {review.content}
                    </p>
                  </Row>
                  <span className="text-danger mr-2">
                    <i
                      className="fas fa-heart"
                      style={{ marginRight: "1rem" }}
                    ></i>
                    {review.countUserLike}
                  </span>
                  <Row className="align-items-center">
                    <span
                      className="description"
                      style={{
                        fontSize: "0.875rem",
                        margin: "1rem",
                        textAlign: "justify",
                        fontWeight: "bold",
                      }}
                    >
                      Tag:{" "}
                    </span>
                    {review.tags.map((tag) => (
                      <span
                        className="badge badge-pill badge-light"
                        style={{
                          color: "#32325d",
                          marginRight: "1rem",
                          textTransform: "none",
                          fontSize: "0.875rem",
                          fontWeight: "normal",
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Row>
          </div>
          <div className="order-xl-2 mb-5 mb-xl-0 col-xl-4">
            <Card className="card-profile shadow">
              <Row
                className="justify-content-center"
                style={{ marginBottom: "2rem" }}
              >
                <div className="order-lg-2 col-lg-3">
                  <div className="card-profile-image">
                    <a>
                      <img
                        className="rounded-circle"
                        src={review.restaurant.logo}
                        width="160px"
                        height="160"
                      ></img>
                    </a>
                  </div>
                </div>
              </Row>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <Col>
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">
                          {review.restaurant.starAverage != null
                            ? review.restaurant.starAverage
                            : 0}
                        </span>
                        <span className="description">Đánh giá</span>
                      </div>
                      <div>
                        <span className="heading">
                          {review.restaurant.countUserLike != null
                            ? review.restaurant.countUserLike
                            : 0}
                        </span>
                        <span className="description">Yêu thích</span>
                      </div>
                      <div>
                        <span className="heading">
                          {review.restaurant.countReservation != null
                            ? review.restaurant.countReservation
                            : 0}
                        </span>
                        <span className="description">Đặt chỗ</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <h5 className="h3">{review.restaurant.name}</h5>
                  <h5 className="h5 font-weight-300">
                    {review.restaurant.address.detail}
                  </h5>
                  <hr className="my-4"></hr>
                  <a href={`/restaurants/${review.restaurant.id}`}>Xem chi tiết</a>
                </div>
              </CardBody>
            </Card>
            <Card className="card-stats shadow" style={{ marginTop: "2rem" }}>
              <CardBody>
                <Row style={{ marginBottom: "1rem" }}>
                  <div className="col">
                    <CardTitle
                      className="text-muted mb-0"
                      style={{ textAlign: "justify" }}
                    >
                      Nếu bài viết vi phạm tiêu chuẩn cộng đồng, bạn có thể xóa
                      để ứng dụng văn minh hơn!
                    </CardTitle>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape text-white rounded-circle" style={{ backgroundColor: "orange" }}>
                      <i className="fas fa-exclamation"></i>
                    </div>
                  </Col>
                </Row>
                <Button color="danger" type="button" onClick={() => setModalOpen(!modalOpen)}>
                  Xóa bài viết
                </Button>
              </CardBody>
            </Card>
          </div>
        </Row>
        {modalOpen && <ConfirmModel
          modal={modalOpen}
          setModal={setModalOpen}
          title={"Thông báo"}
          handleAction={handleDelete}
          message={`Xác nhận xóa bài review ?`} />}
      </Container>
    </>
  );
}

ReviewDetail.layout = AdminLayout;
ReviewDetail.title="Review";


export default ReviewDetail;
