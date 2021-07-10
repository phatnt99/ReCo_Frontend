import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import {
  Card,
  Container,
  Row,
  Col,
  CardHeader,
  CardBody,
  Button,
  Modal,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardFooter,
  Spinner,
  Form,
  FormGroup,
  InputGroup
} from "reactstrap";
import spring from "../../springRoute";
import ConfirmModal from "../../components/ConfirmModal";
import { SpringPagination, SpringTable } from "../../components/SpringTable";
import reservationService from "../../services/reservationService";
import AdminLayout from "../../layouts/AdminLayout";
import Alert from "../../components/Alert2";

const type = {
  WAITING: 1,
  APPROVE: 2,
  CANCEL: 3,
  HISTORY: 4
}

//Headers
const headers = [
  {
    name: "",
    field: "checkbox",
    isSortable: false,
  },
  {
    name: "",
    isSortable: false,
  },
  {
    name: "Người dùng",
    field: "user.fullName",
    isSortable: true,
  },
  {
    name: "Nhà hàng",
    field: "restaurant.name",
    isSortable: true,
  },
  {
    name: "Số lượng",
    field: "partySize",
    isSortable: false,
  },
  {
    name: "Thời gian đến",
    field: "timeComing",
    isSortable: true,
  },
  {
    name: "Ngày đặt",
    field: "createdAt",
    isSortable: true,
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

function ReservationRow({ reservation, model, setModel, type }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <tr>
        <td style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              checked={model.includes(reservation.id)}
              value={reservation.id}
              onClick={(e) => {
                //handle check one
                if (!model.includes(reservation.id)) {
                  setModel([
                    ...model,
                    reservation.id
                  ]);
                }
                else {
                  setModel(model.filter(m => m != reservation.id))
                }
              }}
            ></input>
          </div>
        </td>
        <td style={{ paddingRight: "0" }}>
          <Button
            outline
            color="secondary"
            className="btn-sm"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <i className="fas fa-eye"></i>
          </Button>
        </td>
        <th
          scope="row"
          style={{
            maxWidth: "25em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <div className="align-items-center media">
            <a className="avatar rounded-circle mr-3" href="">
              <img src={reservation.user.avatar}></img>
            </a>
            <div className="media">
              <span className="mb-0 text-sm">{reservation.user.fullName}</span>
            </div>
          </div>
        </th>

        <td
          style={{
            maxWidth: "15rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{reservation.restaurant.name}</span>
        </td>
        <td>
          <span className="mb-0">{reservation.partySize}</span>
        </td>
        <td>
          <span className="mb-0">
            {new Date(reservation.timeComing).toLocaleString()}
          </span>
        </td>
        <td>
          <span className="mb-0">
            {new Date(reservation.createdAt).toLocaleString()}
          </span>
        </td>
      </tr>
      {/* Modal Detail */}
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <Card className="card-pricing bg-gradient-success border-0" style={{ width: '45vw' }}>
          <CardHeader className="bg-transparent text-center">
            {type == 1 && <div className="float-center btn btn-default btn-sm">
              Đang chờ xác nhận
            </div>}
            {type == 2 && <div className="float-center btn btn-default btn-sm">
              Đã xác nhận
            </div>}
            {type == 3 && <div className="float-center btn btn-default btn-sm">
              Đã hủy
            </div>}
            {type == 4 && <div className="float-center btn btn-default btn-sm">
              Đã hoàn thành
            </div>}
            <h4 className="text-uppercase ls-1 text-white py-2 mb-0">
              {reservation.restaurant.name}
            </h4>
            <span className="text-white">
              {reservation.restaurant.address.detail}
            </span>
          </CardHeader>
          <CardBody
            style={{
              paddingLeft: "3rem !important",
              paddingRight: "3rem !important",
              paddingTop: "0!important",
              paddingBottom: "0!important",
            }}
          >
            <Row>
              <Col className="col-6">
                <Row>
                  <Col><p className="text-white">Số người:</p></Col>
                  <Col><p className="pl-2">{reservation.partySize} người</p></Col>
                </Row>
              </Col>
              <Col className="col-6 text-right">
                <Row>
                  <Col><p className="text-white">Thời gian đến:</p></Col>
                  <Col><p className="pl-2">{new Date(reservation.timeComing).toLocaleDateString()}</p></Col>
                </Row>
              </Col>
              <Col className="col-6">
                <Row>
                  <Col><p className="text-white">Mã giảm giá:</p></Col>
                  <Col><p className="pl-2">{reservation.voucher?.code}</p></Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="col-12">
                <h4>Thông tin người đặt chỗ</h4>
              </Col>
              <Col className="col-6">
                <Row>
                  <Col><p className="text-white">Tên người đặt:</p></Col>
                  <Col><p className="pl-2">{reservation.fullName}</p></Col>
                </Row>
              </Col>
              <Col className="col-6 text-right">
                <Row>
                  <Col><p className="text-white">Số điện thoại:</p></Col>
                  <Col><p className="pl-2">{reservation.phone}</p></Col>
                </Row>
              </Col>
              <Col className="col-6">
                <Row>
                  <Col><p className="text-white">Email:</p></Col>
                  <Col><p className="pl-2">{reservation.email}</p></Col>
                </Row>
              </Col>
              <Col className="col-12">
                <p className="text-white">Thông tin thêm:</p>
                <p>{reservation.note}</p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Modal>
    </>
  );
}

function ReservationWaitApprove({ id, reload, setR }) {
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    if (checkAll) {
      let map = reservations.content.map(c => c.id);
      setModel(map);
    } else {
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == reservations?.content?.length) {
        setModel([]);
      }
    };
  }, [checkAll])

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size])

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == reservations?.content?.length)
      setCheckAll(true);
    else setCheckAll(false);
  }, [model]);


  const HeaderComponent = [];

  headers.forEach((header) => {
    if (header.field == "checkbox")
      HeaderComponent.push(
        <th style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              checked={checkAll}
              onChange={() => setCheckAll(!checkAll)}
            ></input>
          </div>
        </th>
      );
    else if (header.isSortable)
      HeaderComponent.push(
        <th
          scope="col"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            setSort({
              field: header.field,
              direction: sort.direction == "ASC" ? "DESC" : "ASC",
            });
          }}
        >
          {header.name}
          <i
            className={
              sort.field == header.field
                ? sort.direction == "ASC"
                  ? sortIcons.find((e) => e.name == "ASC").icon
                  : sortIcons.find((e) => e.name == "DESC").icon
                : sortIcons.find((e) => e.name == "DEFAULT").icon
            }
          />
        </th>
      );
    else HeaderComponent.push(<th scope="col">{header.name}</th>);
  });

  // Data fetching
  let query = `${spring.reservation}/type/1?page=${page}&size=${size}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (id != 0) {
    query = `${spring.reservation}/type/1/restaurant/${id}?page=${page}&size=${size}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  }
  const { data: reservations, error } = useSWR(query);

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow reservation={reservation} model={model} setModel={setModel} type={1} />
    ))
  }

  const handleApprove = (type) => {
    console.log(model);
    reservationService.approve(model, type).then(res => {
      Alert.showUpdateSuccess();
      mutate(query);
      setR(!reload);
    });
  }

  const handleDelete = () => {
    reservationService.delete(model).then(res => {
      Alert.showDeleteSuccess();
      mutate(query);
      setR(!reload);
    })
  }

  if (!reservations)
    return (
      <>
        <Card>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col></Col>
              <Col className="text-right">
                <div style={{ visibility: model.length != 0 ? 'visible' : 'hidden' }}>
                  <Button className="btn btn-sm" color="success" type="button"
                    onClick={() => handleApprove(type.APPROVE)}>
                    <i
                      className="fas fa-thumbs-up"
                      style={{ color: "white", paddingRight: "0.5rem" }}
                    ></i>
                    Xác nhận
                  </Button>
                  <Button className="btn btn-sm" color="default" type="button"
                    onClick={() => handleApprove(type.CANCEL)}>
                    <i
                      className="fas fa-thumbs-down"
                      style={{ color: "white", paddingRight: "0.5rem" }}
                    ></i>
                    Từ chối
                  </Button>
                  <Button
                    className="btn btn-warning btn-sm"
                    type="button"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    <i
                      className="fas fa-times-circle"
                      style={{ color: "white", paddingRight: "0.5rem" }}
                    ></i>
                    Xóa
                  </Button>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <SpringTable renderRow={() => <div>
            <Spinner type="grow" color="primary" />
          </div>} HeaderCommponent={HeaderComponent} />
        </Card>
      </>
    );

  return (
    <>
      <Card>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col></Col>
            <Col className="text-right">
              <div style={{ visibility: model.length != 0 ? 'visible' : 'hidden' }}>
                <Button className="btn btn-sm" color="success" type="button"
                  onClick={() => handleApprove(type.APPROVE)}>
                  <i
                    className="fas fa-thumbs-up"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  Xác nhận
                </Button>
                <Button className="btn btn-sm" color="default" type="button"
                  onClick={() => handleApprove(type.CANCEL)}>
                  <i
                    className="fas fa-thumbs-down"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  Từ chối
                </Button>
                <Button
                  className="btn btn-warning btn-sm"
                  type="button"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <i
                    className="fas fa-times-circle"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  Xóa
                </Button>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reservations}
            setPage={setPage}
            size={size}
            setSize={setSize} />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={handleDelete}
        message={`Xác nhận xóa đặt chỗ ?`} />
    </>
  );
}

function ReservationApproved({ id, reload, setR }) {
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    console.log("Vo6 hay khong ");
    if (checkAll) {
      let map = reservations.content.map(c => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == reservations?.content?.length) {
        setModel([]);
      }
    };
  }, [checkAll])

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size])

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == reservations?.content?.length)
      setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

  const HeaderComponent = [];

  headers.forEach((header) => {
    if (header.field == "checkbox")
      HeaderComponent.push(
        <th style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              checked={checkAll}
              onChange={() => setCheckAll(!checkAll)}
            ></input>
          </div>
        </th>
      );
    else if (header.isSortable)
      HeaderComponent.push(
        <th
          scope="col"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            setSort({
              field: header.field,
              direction: sort.direction == "ASC" ? "DESC" : "ASC",
            });
          }}
        >
          {header.name}
          <i
            className={
              sort.field == header.field
                ? sort.direction == "ASC"
                  ? sortIcons.find((e) => e.name == "ASC").icon
                  : sortIcons.find((e) => e.name == "DESC").icon
                : sortIcons.find((e) => e.name == "DEFAULT").icon
            }
          />
        </th>
      );
    else HeaderComponent.push(<th scope="col">{header.name}</th>);
  });

  // Data fetching
  let query = `${spring.reservation}/type/2?page=${page}&size=${size}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (id != 0) {
    query = `${spring.reservation}/type/2/restaurant/${id}?page=${page}&size=${size}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  }
  const { data: reservations, error } = useSWR(query);

  useEffect(() => {
    mutate(query);
  }, [reload])

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow reservation={reservation} model={model} setModel={setModel} type={2} />
    ))
  }

  const handleApprove = (type) => {
    reservationService.approve(model, type).then(res => {
      Alert.showUpdateSuccess();
      mutate(query);
      setR(!reload);
    });
  }

  const handleDelete = () => {
    reservationService.delete(model).then(res => {
      Alert.showDeleteSuccess();
      mutate(query);
      setR(!reload);
    })
  }

  if (!reservations)
    return (
      <>
        <Card>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col></Col>
              <Col className="text-right">
                <div style={{ visibility: model.length != 0 ? 'visible' : 'hidden' }}>
                  <Button className="btn btn-sm" color="success" type="button"
                    onClick={() => handleApprove(type.HISTORY)}>
                    <i
                      className="fas fa-thumbs-up"
                      style={{ color: "white", paddingRight: "0.5rem" }}
                    ></i>
                    Hoàn tất
                  </Button>
                  <Button className="btn btn-sm" color="default" type="button"
                    onClick={() => handleApprove(type.CANCEL)}>
                    <i
                      className="fas fa-thumbs-down"
                      style={{ color: "white", paddingRight: "0.5rem" }}
                    ></i>
                    Hủy đặt chỗ
                  </Button>
                  <Button
                    className="btn btn-warning btn-sm"
                    type="button"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    <i
                      className="fas fa-times-circle"
                      style={{ color: "white", paddingRight: "0.5rem" }}
                    ></i>
                    Xóa
                  </Button>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <SpringTable renderRow={() => <div>
            <Spinner type="grow" color="primary" />
          </div>} HeaderCommponent={HeaderComponent} />
        </Card>
      </>
    );

  return (
    <>
      <Card>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col></Col>
            <Col className="text-right">
              <div style={{ visibility: model.length != 0 ? 'visible' : 'hidden' }}>
                <Button className="btn btn-sm" color="success" type="button"
                  onClick={() => handleApprove(type.HISTORY)}>
                  <i
                    className="fas fa-thumbs-up"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  Hoàn tất
                </Button>
                <Button className="btn btn-sm" color="default" type="button"
                  onClick={() => handleApprove(type.CANCEL)}>
                  <i
                    className="fas fa-thumbs-down"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  Hủy đặt chỗ
                </Button>
                <Button
                  className="btn btn-warning btn-sm"
                  type="button"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <i
                    className="fas fa-times-circle"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  Xóa
                </Button>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reservations}
            setPage={setPage}
            size={size}
            setSize={setSize} />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={handleDelete}
        message={`Xác nhận xóa đặt chỗ ?`} />
    </>
  );
}

function ReservationCanceled({ id, reload, setR }) {
  //
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    console.log("Vo6 hay khong ");
    if (checkAll) {
      let map = reservations.content.map(c => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == reservations?.content?.length) {
        setModel([]);
      }
    };
  }, [checkAll])

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size])

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == reservations?.content?.length)
      setCheckAll(true);
    else setCheckAll(false);
  }, [model]);


  const HeaderComponent = [];

  headers.forEach((header) => {
    if (header.field == "checkbox")
      HeaderComponent.push(
        <th style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              checked={checkAll}
              onChange={() => setCheckAll(!checkAll)}
            ></input>
          </div>
        </th>
      );
    else if (header.isSortable)
      HeaderComponent.push(
        <th
          scope="col"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            setSort({
              field: header.field,
              direction: sort.direction == "ASC" ? "DESC" : "ASC",
            });
          }}
        >
          {header.name}
          <i
            className={
              sort.field == header.field
                ? sort.direction == "ASC"
                  ? sortIcons.find((e) => e.name == "ASC").icon
                  : sortIcons.find((e) => e.name == "DESC").icon
                : sortIcons.find((e) => e.name == "DEFAULT").icon
            }
          />
        </th>
      );
    else HeaderComponent.push(<th scope="col">{header.name}</th>);
  });

  // Data fetching
  let query = `${spring.reservation}/type/3?page=${page}&size=${size}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (id != 0) {
    query = `${spring.reservation}/type/3/restaurant/${id}?page=${page}&size=${size}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  }
  const { data: reservations, error } = useSWR(query);

  useEffect(() => {
    mutate(query);
  }, [reload])

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow reservation={reservation} model={model} setModel={setModel} type={3} />
    ))
  }

  const handleDelete = () => {
    reservationService.delete(model).then(res => {
      Alert.showDeleteSuccess();
      mutate(query);
      setR(!reload);
    })
  }

  if (!reservations)
    return (
      <>
        <Card>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col></Col>
              <Col className="text-right">
                <div style={{ visibility: model.length != 0 ? 'visible' : 'hidden' }}>
                  <Button
                    className="btn btn-warning btn-sm"
                    type="button"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    <i
                      className="fas fa-times-circle"
                      style={{ color: "white", paddingRight: "0.5rem" }}
                    ></i>
                    Xóa
                  </Button>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <SpringTable renderRow={() => <div>
            <Spinner type="grow" color="primary" />
          </div>} HeaderCommponent={HeaderComponent} />
        </Card>
      </>
    );

  return (
    <>
      <Card>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col></Col>
            <Col className="text-right">
              <div style={{ visibility: model.length != 0 ? 'visible' : 'hidden' }}>
                <Button
                  className="btn btn-warning btn-sm"
                  type="button"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <i
                    className="fas fa-times-circle"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  Xóa
                </Button>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reservations}
            setPage={setPage}
            size={size}
            setSize={setSize} />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={handleDelete}
        message={`Xác nhận xóa đặt chỗ ?`} />
    </>
  );
}

function ReservationHistory({ id, reload, setR }) {
  //
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    console.log("Vo6 hay khong ");
    if (checkAll) {
      let map = reservations.content.map(c => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == reservations?.content?.length) {
        setModel([]);
      }
    };
  }, [checkAll])

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size])

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == reservations?.content?.length)
      setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

  const HeaderComponent = [];

  headers.forEach((header) => {
    if (header.field == "checkbox")
      HeaderComponent.push(
        <th style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              checked={checkAll}
              onChange={() => setCheckAll(!checkAll)}
            ></input>
          </div>
        </th>
      );
    else if (header.isSortable)
      HeaderComponent.push(
        <th
          scope="col"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            setSort({
              field: header.field,
              direction: sort.direction == "ASC" ? "DESC" : "ASC",
            });
          }}
        >
          {header.name}
          <i
            className={
              sort.field == header.field
                ? sort.direction == "ASC"
                  ? sortIcons.find((e) => e.name == "ASC").icon
                  : sortIcons.find((e) => e.name == "DESC").icon
                : sortIcons.find((e) => e.name == "DEFAULT").icon
            }
          />
        </th>
      );
    else HeaderComponent.push(<th scope="col">{header.name}</th>);
  });

  // Data fetching
  let query = `${spring.reservation}/type/4?page=${page}&size=${size}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (id != 0) {
    query = `${spring.reservation}/type/4/restaurant/${id}?page=${page}&size=${size}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  }
  const { data: reservations, error } = useSWR(query);

  useEffect(() => {
    mutate(query);
  }, [reload])

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow reservation={reservation} model={model} setModel={setModel} type={4} />
    ))
  }

  const handleDelete = () => {
    reservationService.delete(model).then(res => {
      Alert.showDeleteSuccess();
      mutate(query);
      setR(!reload);
    })
  }

  if (!reservations)
    return (
      <>
        <Card>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col></Col>
              <Col className="text-right">
                <div style={{ visibility: model.length != 0 ? 'visible' : 'hidden' }}>
                  <Button
                    className="btn btn-warning btn-sm"
                    type="button"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    <i
                      className="fas fa-times-circle"
                      style={{ color: "white", paddingRight: "0.5rem" }}
                    ></i>
                    Xóa
                  </Button>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <SpringTable renderRow={() => <div>
            <Spinner type="grow" color="primary" />
          </div>} HeaderCommponent={HeaderComponent} />
        </Card>
      </>
    );

  return (
    <>
      <Card>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col></Col>
            <Col className="text-right">
              <div style={{ visibility: model.length != 0 ? 'visible' : 'hidden' }}>
                <Button
                  className="btn btn-warning btn-sm"
                  type="button"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <i
                    className="fas fa-times-circle"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  Xóa
                </Button>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reservations}
            setPage={setPage}
            size={size}
            setSize={setSize} />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={handleDelete}
        message={`Xác nhận xóa đặt chỗ ?`} />
    </>
  );
}

function Reservation() {
  const [model, setModel] = useState(0);
  const [reload, setReload] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [hTabsIcons, setHTabsIcons] = React.useState("hTabsIcons-1");

  // Data fetching
  const { data: restaurants, error } = useSWR(spring.restaurant + '?size=' + 790);

  const handleChangeRestaurant = (e) => {
    let restaurantId = e.target.value;
    setModel(restaurantId);
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
          <Col>
            <Card
              className="bg-secondary shadow"
              style={{ marginBottom: "1rem" }}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col>
                    
                  </Col>
                  <Col className="text-right col-6">
                    <select className="form-control"
                      onChange={handleChangeRestaurant}>
                      <option value={0}>All</option>
                      {restaurants && restaurants.content.map(r => <option value={r.id}>{r.name}</option>)}
                    </select>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody style={{ padding: "0" }}>
                <div className="nav-wrapper" style={{ padding: "1.5rem" }}>
                  <Nav
                    className="nav-fill flex-column flex-md-row"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={
                          "mb-sm-3 mb-md-0 " +
                          (hTabsIcons === "hTabsIcons-1" ? "active" : "")
                        }
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setHTabsIcons("hTabsIcons-1");
                        }}
                      >
                        <i className="ni ni-cloud-upload-96 mr-2"></i>
                        Chờ xác nhận
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={
                          "mb-sm-3 mb-md-0 " +
                          (hTabsIcons === "hTabsIcons-2" ? "active" : "")
                        }
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setHTabsIcons("hTabsIcons-2");
                        }}
                      >
                        <i className="ni ni-bell-55 mr-2"></i>
                        Đã đặt chỗ
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={
                          "mb-sm-3 mb-md-0 " +
                          (hTabsIcons === "hTabsIcons-3" ? "active" : "")
                        }
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setHTabsIcons("hTabsIcons-3");
                        }}
                      >
                        <i className="ni ni-calendar-grid-58 mr-2"></i>
                        Đã hủy
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={
                          "mb-sm-3 mb-md-0 " +
                          (hTabsIcons === "hTabsIcons-4" ? "active" : "")
                        }
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setHTabsIcons("hTabsIcons-4");
                        }}
                      >
                        <i className="ni ni-calendar-grid-58 mr-2"></i>
                        Lịch sử
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>

                <TabContent id="myTabContent" activeTab={hTabsIcons}>
                  <TabPane tabId="hTabsIcons-1" role="tabpanel">
                    <ReservationWaitApprove id={model} reload={reload} setR={setReload} />
                  </TabPane>
                  <TabPane tabId="hTabsIcons-2" role="tabpanel">
                    <ReservationApproved id={model} reload={reload} setR={setReload} />
                  </TabPane>
                  <TabPane tabId="hTabsIcons-3" role="tabpanel">
                    <ReservationCanceled id={model} reload={reload} setR={setReload} />
                  </TabPane>
                  <TabPane tabId="hTabsIcons-4" role="tabpanel">
                    <ReservationHistory id={model} reload={reload} setR={setReload} />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Reservation.layout = AdminLayout;
Reservation.title = "Đặt Chỗ";

export default Reservation;
