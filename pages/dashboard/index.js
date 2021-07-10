import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Card,
  Container,
  Row,
  Col,
  CardHeader,
  Table,
  CardBody,
  ListGroup,
  ListGroupItem,
  Spinner,
  Input
} from "reactstrap";
import AdminLayout from "../../layouts/AdminLayout";
import { Bar, Doughnut, PolarArea } from "react-chartjs-2";
import spring from "../../springRoute";
import Link from "next/link";

function TagRow({ tag, width }) {
  return (
    <>
      <tr>
        <td>{tag.tag.name}</td>
        <td style={{ maxWidth: "3rem" }}>{tag.countTag}</td>
        <td>
          <div className="d-flex align-items-center">
            <span className="mr-2">
              {((tag.countTag * 100) / width).toFixed(2)}%
            </span>
          </div>
          <div>
            <div className="progress">
              <div
                className="progress-bar bg-gradient-danger"
                role="progressbar"
                aria-valuenow={tag.countTag / width}
                aria-valuemin={0}
                aria-valuemax={1}
                style={{ width: (tag.countTag * 100) / width + "%" }}
              ></div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

function CommentRow({ comment }) {
  const el = [];
  for (let i = 0; i < comment.overallStar; i++) {
    el.push(<i className="fas fa-star" style={{ color: "orange" }}></i>);
  }
  for (let i = 0; i < Math.floor(5 - comment.overallStar); i++) {
    el.push(<i className="fas fa-star" style={{ color: "#8898aa" }}></i>);
  }

  return (
    <Link href={"/comments/" + comment.id}>
      <ListGroupItem className=" list-group-item-action flex-column align-items-start py-4 px-4">
        <div className=" d-flex w-100 justify-content-between">
          <div>
            <div className=" d-flex w-100 align-items-center">
              <img
                alt="..."
                className=" avatar avatar-xs mr-2"
                src={comment.user.avatar}
              ></img>
              <Col>
                <h5 className=" mb-1">{comment.user.fullName}</h5>
                {el}
              </Col>
            </div>
          </div>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
        </div>
        <h4 className=" mt-3 mb-1">{comment.restaurant.name}</h4>
        <p className=" text-sm mb-0">{comment.content}</p>
      </ListGroupItem>
    </Link>
  );
}

function Tag({ data, width }) {
  // //state
  // const [name, setName] = useState("");
  // const [result, setResult] = useState({
  //   type: "",
  //   message: "",
  // });
  // //Pagination
  // const [page, setPage] = useState(0);
  // const [size, setSize] = useState(20);
  // const [sort, setSort] = useState({
  //   field: "",
  //   direction: "DESC",
  // });

  //Headers
  const headers = [
    {
      name: "Tên thẻ",
      field: "name",
      isSortable: true,
      sortOrder: 0,
    },
    {
      name: "Số lượng nhà hàng",
      isSortable: true,
    },
    {
      name: "",
      isSortable: false,
    },
  ];
  const sortIcons = [
    {
      name: "ASC",
      icon: "fas fa-long-arrow-alt-up",
    },
    {
      name: "DESC",
      icon: "fas fa-long-arrow-alt-down",
    },
    {
      name: "DEFAULT",
      icon: "fas fa-exchange-alt fa-rotate-90",
    },
  ];
  const HeaderComponent = [];

  headers.forEach((header) => {
    if (header.isSortable)
      HeaderComponent.push(
        <th scope="col" style={{ cursor: "pointer" }}>
          {header.name}
        </th>
      );
    else HeaderComponent.push(<th scope="col">{header.name}</th>);
  });

  // if (!tags)
  //   return (
  //     <>
  //       <Row>
  //         <div className="col">
  //           <p>Loading...</p>
  //         </div>
  //       </Row>
  //     </>
  //   );

  // caculate

  return (
    <>
      <Table
        id="tag"
        className="align-items-center table-flush table"
        responsive
      >
        <thead className="thead-light">
          <tr>{HeaderComponent}</tr>
        </thead>
        <tbody>
          {data.map((t) => (
            <TagRow tag={t} width={width} />
          ))}
        </tbody>
      </Table>
    </>
  );
}

function Dashboard() {
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [hTabsIcons, setHTabsIcons] = React.useState("hTabsIcons-1");
  const [year, setYear] = useState((new Date()).getFullYear());

  // Data fetching
  let url = `${spring.dashboard}?year=${year}`;
  const { data: analys, error } = useSWR(url);
  //const { data: comments, error } = useSWR(spring.comment);

  if (!analys)
    return (
      <>
        <div className="header bg-gradient-dark pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                <div className="col-lg-6 col-xl-3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <Col>
                          <Spinner type="grow" color="primary" />
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-utensils"></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-lg-6 col-xl-3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <Col>
                          <Spinner type="grow" color="primary" />
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                            <i className="fas fa-users"></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-lg-6 col-xl-3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <Col>
                          <Spinner type="grow" color="primary" />
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                            <i className="fas fa-chart-bar"></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-lg-6 col-xl-3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <Col>
                          <Spinner type="grow" color="primary" />
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fas fa-hand-peace"></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Row>
            </div>
          </Container>
        </div>
        {/* Body */}
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow" style={{ marginBottom: "3rem" }}>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <Col>
                    <h3 className="mb-0">Tổng quan</h3>
                    </Col>
                    <Col></Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Spinner type="grow" color="primary" />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="mb-5 mb-xl-0 col-xl-7">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <Col>
                      <h3 className="mb-0">Phân bố nhà hàng theo thẻ</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody style={{ padding: "0!important" }}>
                  <Spinner type="grow" color="primary" />
                </CardBody>
              </Card>
            </Col>
            <Col className="col-xl-5">
              <Card className="shadow" style={{ marginBottom: "2rem" }}>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <Col>
                      <h3 className="mb-0">Phân bố nhà hàng theo quận</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Spinner type="grow" color="primary" />
                </CardBody>
              </Card>
              <Card className="shadow" style={{ marginBottom: "2rem" }}>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <Col>
                      <h3 className="mb-0">Đánh giá mới nhất</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Spinner type="grow" color="primary" />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );

  const districts = analys.districtAndRestaurants.map((d) => d.name);
  const districtCounts = analys.districtAndRestaurants.map((d) => d.count);
  const colorDistricts = analys.districtAndRestaurants.map((d) => {
    const randomBetween = (min, max) =>
      min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    const rgb = `rgb(${r},${g},${b})`;
    return rgb;
  });
  const districtData = {
    labels: districts,
    datasets: [
      {
        label: "My First Dataset",
        data: districtCounts,
        backgroundColor: colorDistricts,
      },
    ],
  };

  const reservationMonths = analys.monthAndReservations.map((r) => r.count);
  const reviewMonths = analys.monthAndReviews.map((r) => r.count);

  return (
    <>
      <div className="header bg-gradient-dark pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <div className="col-lg-6 col-xl-3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="text-uppercase text-muted mb-0 card-title">
                          Nhà hàng
                        </h5>
                        <span className="h2 font-weight-bold mb-0">
                          {analys.restaurantCount}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-utensils"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
              <div className="col-lg-6 col-xl-3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="text-uppercase text-muted mb-0 card-title">
                          Người dùng
                        </h5>
                        <span className="h2 font-weight-bold mb-0">
                          {analys.userCount}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-users"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
              <div className="col-lg-6 col-xl-3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="text-uppercase text-muted mb-0 card-title">
                          Đặt chỗ
                        </h5>
                        <span className="h2 font-weight-bold mb-0">
                          {analys.reservationCount}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
              <div className="col-lg-6 col-xl-3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="text-uppercase text-muted mb-0 card-title">
                          Review
                        </h5>
                        <span className="h2 font-weight-bold mb-0">
                          {analys.reviewCount}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-hand-peace"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </Row>
          </div>
        </Container>
      </div>
      {/* Body */}
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow" style={{ marginBottom: "3rem" }}>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Tổng quan
                    </h6>
                  </Col>
                  <Col sm={2}>
                    <Input type="number" bsSize="sm" value={year}
                    onChange={e => setYear(e.target.value)}/>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="col-6">
                    <Bar
                      type="bar"
                      data={{
                        labels: [
                          "Tháng 1",
                          "Tháng 2",
                          "Tháng 3",
                          "Tháng 4",
                          "Tháng 5",
                          "Tháng 6",
                          "Tháng 7",
                          "Tháng 8",
                          "Tháng 9",
                          "Tháng 10",
                          "Tháng 11",
                          "Tháng 12",
                        ],

                        datasets: [
                          {
                            label: "Lượt đặt chỗ",
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: reservationMonths,
                            maxBarThickness: 10,
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                callback: function (value) {
                                  if (!(value % 10)) {
                                    //return '$' + value + 'k'
                                    return value;
                                  }
                                },
                              },
                            },
                          ],
                        },
                        tooltips: {
                          callbacks: {
                            label: function (item, data) {
                              var label =
                                data.datasets[item.datasetIndex].label || "";
                              var yLabel = item.yLabel;
                              var content = "";
                              if (data.datasets.length > 1) {
                                content += label;
                              }
                              content += yLabel;
                              return content;
                            },
                          },
                        },
                      }}
                    />
                  </Col>
                  <Col>
                    <Bar
                      type="bar"
                      data={{
                        labels: [
                          "Tháng 1",
                          "Tháng 2",
                          "Tháng 3",
                          "Tháng 4",
                          "Tháng 5",
                          "Tháng 6",
                          "Tháng 7",
                          "Tháng 8",
                          "Tháng 9",
                          "Tháng 10",
                          "Tháng 11",
                          "Tháng 12",
                        ],

                        datasets: [
                          {
                            label: "Lượt review",
                            backgroundColor: "#fb6340",
                            borderColor: "#fb6340",
                            data: reviewMonths,
                            maxBarThickness: 10,
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                callback: function (value) {
                                  if (!(value % 10)) {
                                    //return '$' + value + 'k'
                                    return value;
                                  }
                                },
                              },
                            },
                          ],
                        },
                        tooltips: {
                          callbacks: {
                            label: function (item, data) {
                              var label =
                                data.datasets[item.datasetIndex].label || "";
                              var yLabel = item.yLabel;
                              var content = "";
                              if (data.datasets.length > 1) {
                                content += label;
                              }
                              content += yLabel;
                              return content;
                            },
                          },
                        },
                      }}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="mb-5 mb-xl-0 col-xl-7">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-0">Phân bố nhà hàng theo thẻ</h5>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody style={{ padding: "0!important" }}>
                <Tag
                  data={analys.tagAndRestaurants}
                  width={analys.restaurantCount}
                />
              </CardBody>
            </Card>
          </Col>
          <Col className="col-xl-5">
            <Card className="shadow" style={{ marginBottom: "2rem" }}>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-0">Phân bố nhà hàng theo quận</h5>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    {districtData && (
                      <Doughnut type="polarArea" data={districtData} />
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card className="shadow" style={{ marginBottom: "2rem" }}>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">Đánh giá mới nhất</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  {analys.comments.map((c) => (
                    <CommentRow comment={c} />
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Dashboard.layout = AdminLayout;
Dashboard.title="Dashboard";

export default Dashboard;
