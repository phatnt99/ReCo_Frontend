import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Table,
} from "reactstrap";
import useSWR, { mutate } from "swr";
import OwnerLayout from "../../../layouts/OwnerLayout";
import spring from "../../../springRoute";
import commentService from "../../../services/commentService";
import routes from "../../../routes";

function CommentDetail() {
  const router = useRouter();
  const { id } = router.query;
  // Data fetching
  let url = `${spring.comment}/${id}`;
  const { data: comment, error } = useSWR(url);

  if (!comment)
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
            <div className="col">
              <p>Loading...</p>
            </div>
          </Row>
        </Container>
      </>
    );

  const overall = [];
  const food = [];
  const service = [];
  const space = [];
  const photo = [];

  if (comment.overallStar != null && comment.overallStar > 0) {
    for (let i = 0; i < comment.overallStar; i++) {
      overall.push(<i className="fas fa-star" style={{ color: "orange" }}></i>);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      overall.push(
        <i className="fas fa-star" style={{ color: "#8898aa" }}></i>
      );
    }
  }

  if (comment.foodStar != null && comment.foodStar > 0) {
    for (let i = 0; i < comment.foodStar; i++) {
      food.push(<i className="fas fa-star" style={{ color: "orange" }}></i>);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      food.push(<i className="fas fa-star" style={{ color: "#8898aa" }}></i>);
    }
  }

  if (comment.serviceStar != null && comment.serviceStar > 0) {
    for (let i = 0; i < comment.serviceStar; i++) {
      service.push(<i className="fas fa-star" style={{ color: "orange" }}></i>);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      service.push(
        <i className="fas fa-star" style={{ color: "#8898aa" }}></i>
      );
    }
  }

  if (comment.aimbianceStar != null && comment.aimbianceStar > 0) {
    for (let i = 0; i < comment.aimbianceStar; i++) {
      space.push(<i className="fas fa-star" style={{ color: "orange" }}></i>);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      space.push(<i className="fas fa-star" style={{ color: "#8898aa" }}></i>);
    }
  }
  if (comment.listPhoto != null && (comment.listPhoto.split(",")).length > 0) {
    for (let i = 0; i < (comment.listPhoto.split(",")).length; i++) {
      photo.push(<img
        src={(comment.listPhoto.split(","))[i]}
        className="img-thumbnail"
        style={{
          width: "7rem",
          height: "7rem",
          objectFit: "cover",
          padding: "0",
          border: "0",
          marginRight: "0.5rem",
          marginBottom: "0.5rem",
        }}
      ></img>);
    }
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
                  marginBottom: "1rem",
                }}
              >
                <CardHeader
                  className="border-0"
                  style={{ backgroundColor: "#f7fafc" }}
                >
                  <Row className="align-items-center">
                    <Col></Col>
                  </Row>
                </CardHeader>
                <CardBody style={{ paddingTop: "1rem !important" }}>
                  <div className="pl-lg-4">
                    <Row className="align-items-center">
                      <Col className="col-auto">
                        <a
                          className="avatar avatar-xl rounded-circle"
                          href="javascript:;"
                        >
                          <img alt="..." src={comment.user.avatar}></img>
                        </a>
                      </Col>
                      <div className="col ml-2">
                        <h4 className="mb-0">
                          <a href="javascript:;">{comment.user.fullName}</a>
                        </h4>
                        <p className="text-sm text-muted mb-0">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Col className="col-auto">
                        <h5 className="h3">{comment.restaurant.name}</h5>
                        <h5 className="h5 font-weight-300">
                          {comment.restaurant.address.detail}
                        </h5>
                      </Col>
                    </Row>
                  </div>
                  <div className="pl-lg-4">
                    <Row>
                      <p
                        className="description"
                        style={{ margin: "1rem", textAlign: "justify" }}
                      >
                        {comment.content}
                      </p>
                    </Row>
                  </div>
                  {(photo.length > 0) && (
                    <h6 className="heading-small text-muted mb-4">Hình ảnh</h6>
                  )}
                  {photo}
                </CardBody>
              </Card>
            </Row>
          </div>
          <div className="order-xl-2 mb-5 mb-xl-0 col-xl-4">
            <Card className="card-profile shadow">
              <Row className="align-items-center" style={{ margin: "0.5rem" }}>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-orange text-white rounded-circle">
                    <i className="fas fa-star" style={{ color: "white" }}></i>
                  </div>
                </Col>
                <div className="col">
                  <span className="heading">Đánh giá</span>
                </div>
              </Row>
              <CardBody className="pt-0">
                <Row>
                  <Col style={{ textAlign: "end" }}>
                    <p className="heading" style={{ textTransform: "none" }}>
                      Chung
                    </p>
                    <p className="heading" style={{ textTransform: "none" }}>
                      Đồ ăn
                    </p>
                    <p className="heading" style={{ textTransform: "none" }}>
                      Dịch vụ
                    </p>
                    <p className="heading" style={{ textTransform: "none" }}>
                      Không gian
                    </p>
                    <p className="heading" style={{ textTransform: "none" }}>
                      Độ ồn
                    </p>
                  </Col>
                  <Col>
                    <p className="heading">{overall}</p>
                    <p className="heading">{food}</p>
                    <p className="heading">{service}</p>
                    <p className="heading">{space}</p>
                    <div>
                      {comment.noiseStar != null &&
                        comment.noiseStar >= 0 &&
                        comment.noiseStar <= 1 && (
                          <p
                            className="heading"
                            style={{
                              color: "#8898aa",
                              textTransform: "none",
                              fontWeight: "normal",
                            }}
                          >
                            Thấp
                          </p>
                        )}
                      {comment.noiseStar != null &&
                        comment.noiseStar > 1 &&
                        comment.noiseStar <= 3 && (
                          <p
                            className="heading"
                            style={{
                              color: "#8898aa",
                              textTransform: "none",
                              fontWeight: "normal",
                            }}
                          >
                            Vừa phải
                          </p>
                        )}
                      {comment.noiseStar != null &&
                        comment.noiseStar > 3 &&
                        comment.noiseStar <= 5 && (
                          <p
                            className="heading"
                            style={{
                              color: "#8898aa",
                              textTransform: "none",
                              fontWeight: "normal",
                            }}
                          >
                            Rất ồn
                          </p>
                        )}
                      {comment.noiseStar == null && (
                        <p
                          className="heading"
                          style={{
                            color: "#8898aa",
                            textTransform: "none",
                            fontWeight: "normal",
                          }}
                        >
                          Chưa đánh giá
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

CommentDetail.layout = OwnerLayout;
CommentDetail.title="Bình Luận";

export default CommentDetail;
