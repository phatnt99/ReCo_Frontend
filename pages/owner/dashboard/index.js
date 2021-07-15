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
  Spinner,
  Input 
} from "reactstrap";
import OwnerLayout from "../../../layouts/OwnerLayout";
import { Bar, Doughnut, PolarArea } from "react-chartjs-2";
import spring from "../../../springRoute";

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
  let url = `${spring.owner_dashboard}?year=${year}`;
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
                        <Spinner type="grow" color="primary" />
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
                        <Spinner type="grow" color="primary" />
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
                    <Col></Col>
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

    const reservationMonths = [0,0,0,0,0,0,0,0,0,0,0,0];
    const reviewMonths = [0,0,0,0,0,0,0,0,0,0,0,0];
  
    analys.monthAndReservations.forEach(v => {
      reservationMonths[v.month-1] = v.count;
    })
  
    analys.monthAndReservations.forEach(v => {
      reviewMonths[v.month-1] = v.count;
    })

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
                    <h3 className="mb-0">Tổng quan</h3>
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
      </Container>
    </>
  );
}

Dashboard.layout = OwnerLayout;
Dashboard.title = "Dashboard";

export default Dashboard;
