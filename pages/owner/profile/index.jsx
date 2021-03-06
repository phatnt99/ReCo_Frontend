import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Container,
  Form,
  FormGroup,
  Label,
  Modal,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
  Spinner,
} from "reactstrap";
import useSWR, { mutate } from "swr";
import AdminLayout from "../../../layouts/OwnerLayout";
import spring from "../../../springRoute";
import restaurantService from "../../../services/restaurantService";
import ConfirmModal from "../../../components/ConfirmModal";
import { SpringPagination, SpringTable } from "../../../components/SpringTable";
import reservationService from "../../../services/reservationService";
import ownerService from "../../../services/ownerService";
import authService from "../../../services/authService";
import Alert from "../../../components/Alert2";
import imageService from "../../../services/voucherService";

const type = {
  WAITING: 1,
  APPROVE: 2,
  BLOCK: 3,
};

const reservationType = {
  WAITING: 1,
  APPROVE: 2,
  CANCEL: 3,
  HISTORY: 4,
};

const userType = {
  WAITING: 1,
  APPROVE: 2,
  BLOCK: 3,
};

function CommentRow({ comment }) {
  const [open, setOpen] = useState(false);
  const el = [];
  for (let i = 0; i < comment.overallStar; i++) {
    el.push(<i className="fas fa-star" style={{ color: "orange" }}></i>);
  }

  return (
    <>
      <tr>
        <td style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              value={comment.id}
            ></input>
          </div>
        </td>
        <td
          style={{
            maxWidth: "13em",
          }}
        >
          <span className="mb-0">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
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
              <img src={comment.user.avatar}></img>
            </a>
            <div className="media">
              <span className="mb-0 text-sm">{comment.user.fullName}</span>
            </div>
          </div>
        </th>
        <td
          style={{
            maxWidth: "20em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{comment.restaurant.name}</span>
        </td>
        <td>{el}</td>
        <td
          style={{
            maxWidth: "23em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{comment.content}</span>
        </td>
        <td
          style={{
            paddingLeft: "0",
          }}
        >
          <Link href={"/comments/" + comment.id}>
            <Button
              outline
              color="secondary"
              className="btn-sm"
              type="button"
              onClick={() => setOpen(true)}
            >
              <i className="fas fa-eye"></i>
            </Button>
          </Link>
        </td>
      </tr>
    </>
  );
}

function Comment({ restaurantId, ownerId }) {
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  //Headers
  const headers = [
    {
      name: "",
      field: "checkbox",
      isSortable: false,
    },
    {
      name: "Ng??y ????ng",
      field: "createdAt",
      isSortable: false,
    },
    {
      name: "Ng?????i d??ng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Nh?? h??ng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "????nh gi??",
      field: "star",
      isSortable: true,
    },
    {
      name: "B??nh lu???n",
      field: "comment",
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
    if (header.field == "checkbox")
      HeaderComponent.push(
        <th style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
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

  const renderRow = () => {
    return comments.content.map((comment) => <CommentRow comment={comment} />);
  };

  // Data fetching
  let query = `${spring.comment}/owner/${ownerId}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (restaurantId != 0) {
    query = `${spring.comment}/restaurant/${restaurantId}/all?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  }
  const { data: comments, error } = useSWR(query);

  if (!comments)
    return (
      <>
        <Card className="shadow" style={{ marginBottom: "1rem" }}>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col></Col>
              <Col className="text-right"></Col>
            </Row>
          </CardHeader>
          <SpringTable
            renderRow={() => <Spinner type="grow" color="primary" />}
            HeaderCommponent={HeaderComponent}
          />
        </Card>
      </>
    );

  return (
    <>
      <Card className="shadow" style={{ marginBottom: "1rem" }}>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col></Col>
            <Col className="text-right"></Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={comments}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />
        </CardFooter>
      </Card>
    </>
  );
}

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
                  setModel([...model, reservation.id]);
                } else {
                  setModel(model.filter((m) => m != reservation.id));
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
        <Card className="card-pricing bg-gradient-success border-0 text-center">
          <CardHeader className="bg-transparent">
            {type == 1 && (
              <div className="float-center btn btn-default btn-sm">
                ??ang ch??? x??c nh???n
              </div>
            )}
            {type == 2 && (
              <div className="float-center btn btn-default btn-sm">
                ???? x??c nh???n
              </div>
            )}
            {type == 3 && (
              <div className="float-center btn btn-default btn-sm">???? h???y</div>
            )}
            {type == 4 && (
              <div className="float-center btn btn-default btn-sm">
                ???? ho??n th??nh
              </div>
            )}
            <h4 className="text-uppercase ls-1 text-white py-3 mb-0">
              {reservation.restaurant.name}
            </h4>
            <span className="text-white">
              {reservation.restaurant.address.detail}
            </span>
          </CardHeader>
          <CardBody
            className="px-lg-7"
            style={{
              paddingLeft: "3rem !important",
              paddingRight: "3rem !important",
              paddingTop: "0!important",
              paddingBottom: "0!important",
            }}
          >
            <ul className="list-unstyled my-4">
              <li>
                <div className="d-flex align-items-center">
                  <div>
                    <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                      <i className="fas fa-user-friends"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="pl-2 text-sm text-white">
                      {reservation.partySize} ng?????i
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-center">
                  <div>
                    <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                      <i className="fas fa-clock"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="pl-2 text-sm text-white">
                      {new Date(reservation.timeComing).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-center">
                  <div>
                    <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                      <i className="fas fa-percentage"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="pl-2 text-sm text-white">
                      {(reservation.voucher?.value / 1).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-baseline">
                  <div>
                    <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                      <i className="fas fa-info"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="pl-2 text-sm text-white">
                      {reservation.fullName}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-baseline">
                  <div>
                    <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="pl-2 text-sm text-white">
                      {reservation.phone}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-baseline">
                  <div>
                    <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                      <i className="fas fa-envelope-open"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="pl-2 text-sm text-white">
                      {reservation.email}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-center">
                  <div>
                    <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                      <i className="fas fa-ellipsis-h"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="pl-2 text-sm text-white">
                      {reservation.note}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </CardBody>
        </Card>
      </Modal>
    </>
  );
}

function ReservationWaitApprove({ id, owner }) {
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    if (checkAll) {
      let map = reservations.content.map((c) => c.id);
      setModel(map);
    } else {
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == reservations?.content?.length) {
        setModel([]);
      }
    }
  }, [checkAll]);

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size]);

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == reservations?.content?.length) setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

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
      name: "Ng?????i d??ng",
      field: "user.fullName",
      isSortable: true,
    },
    {
      name: "Nh?? h??ng",
      field: "restaurant.name",
      isSortable: true,
    },
    {
      name: "S??? l?????ng",
      field: "partySize",
      isSortable: true,
    },
    {
      name: "Th???i gian ?????n",
      field: "timeComing",
      isSortable: true,
    },
    {
      name: "Ng??y ?????t",
      field: "createdAt",
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
  let query = `${spring.reservation}/type/1/owner/${owner}?page=${page}&size=${size}`;
  if (id != 0) {
    query = `${spring.reservation}/type/1/restaurant/${id}?page=${page}&size=${size}`;
  }

  const { data: reservations, error } = useSWR(query);

  if (!reservations)
    return (
      <>
        <Card>
          <CardHeader className="border-0">
            <Row className="align-items-center"></Row>
          </CardHeader>
          <SpringTable
            renderRow={() => <Spinner type="grow" color="primary" />}
            HeaderCommponent={HeaderComponent}
          />
        </Card>
      </>
    );

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow
        reservation={reservation}
        model={model}
        setModel={setModel}
        type={1}
      />
    ));
  };

  const handleApprove = (type) => {
    console.log(model);
    reservationService.approve(model, type).then((res) => {
      if (res.status == "update") {
        Alert.showUpdateSuccess();
        mutate(query);
      }
    });
  };

  const handleDelete = () => {
    reservationService.delete(model).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
        mutate(query);
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col></Col>
            <Col className="text-right">
              <Button
                className="btn btn-sm"
                color="success"
                type="button"
                onClick={() => handleApprove(type.APPROVE)}
              >
                <i
                  className="fas fa-thumbs-up"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                X??c nh???n
              </Button>
              <Button
                className="btn btn-sm"
                color="default"
                type="button"
                onClick={() => handleApprove(reservationType.CANCEL)}
              >
                <i
                  className="fas fa-thumbs-down"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                T??? ch???i
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reservations}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Th??ng b??o"}
        handleAction={handleDelete}
        message={`X??c nh???n x??a ?????t ch??? ?`}
      />
    </>
  );
}

function ReservationApproved({ id, owner }) {
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    console.log("Vo6 hay khong ");
    if (checkAll) {
      let map = reservations.content.map((c) => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == reservations?.content?.length) {
        setModel([]);
      }
    }
  }, [checkAll]);

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size]);

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == reservations?.content?.length) setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

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
      name: "Ng?????i d??ng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Nh?? h??ng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "S??? l?????ng",
      field: "star",
      isSortable: true,
    },
    {
      name: "Th???i gian",
      field: "timeComing",
      isSortable: true,
    },
    {
      name: "Ng??y ?????t",
      field: "createdAt",
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
  let query = `${spring.reservation}/type/2/owner/${owner}?page=${page}&size=${size}`;
  if (id != 0) {
    query = `${spring.reservation}/type/2/restaurant/${id}?page=${page}&size=${size}`;
  }
  const { data: reservations, error } = useSWR(query);

  if (!reservations)
    return (
      <>
        <Card>
          <CardHeader className="border-0">
            <Row className="align-items-center"></Row>
          </CardHeader>
          <SpringTable
            renderRow={() => <Spinner type="grow" color="primary" />}
            HeaderCommponent={HeaderComponent}
          />
        </Card>
      </>
    );

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow
        reservation={reservation}
        model={model}
        setModel={setModel}
        type={2}
      />
    ));
  };

  const handleApprove = (type) => {
    reservationService.approve(model, type).then((res) => {
      if (res.status == "update") {
        Alert.showUpdateSuccess();
        mutate(query);
      }
    });
  };

  const handleDelete = () => {
    reservationService.delete(model).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
        mutate(query);
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col className="text-right">
              <Button
                className="btn btn-sm"
                color="success"
                type="button"
                onClick={() => handleApprove(reservationType.HISTORY)}
              >
                <i
                  className="fas fa-thumbs-up"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Ho??n t???t
              </Button>
              <Button
                className="btn btn-sm"
                color="default"
                type="button"
                onClick={() => handleApprove(reservationType.CANCEL)}
              >
                <i
                  className="fas fa-thumbs-down"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                H???y ?????t ch???
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reservations}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Th??ng b??o"}
        handleAction={handleDelete}
        message={`X??c nh???n x??a ?????t ch??? ?`}
      />
    </>
  );
}

function ReservationCanceled({ id, owner }) {
  //
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    console.log("Vo6 hay khong ");
    if (checkAll) {
      let map = reservations.content.map((c) => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == reservations?.content?.length) {
        setModel([]);
      }
    }
  }, [checkAll]);

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size]);

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == reservations?.content?.length) setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

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
      name: "Ng?????i d??ng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Nh?? h??ng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "S??? l?????ng",
      field: "star",
      isSortable: true,
    },
    {
      name: "Th???i gian",
      field: "timeComing",
      isSortable: true,
    },
    {
      name: "Ng??y ?????t",
      field: "createdAt",
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
  let query = `${spring.reservation}/type/3/owner/${owner}?page=${page}&size=${size}`;
  if (id != 0) {
    query = `${spring.reservation}/type/3/restaurant/${id}?page=${page}&size=${size}`;
  }
  const { data: reservations, error } = useSWR(query);

  if (!reservations)
    return (
      <>
        <Card>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col></Col>
              <Col className="text-right"></Col>
            </Row>
          </CardHeader>
          <SpringTable
            renderRow={() => <Spinner type="grow" color="primary" />}
            HeaderCommponent={HeaderComponent}
          />
        </Card>
      </>
    );

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow
        reservation={reservation}
        model={model}
        setModel={setModel}
        type={3}
      />
    ));
  };

  const handleDelete = () => {
    reservationService.delete(model).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
        mutate(query);
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col></Col>
            <Col className="text-right"></Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reservations}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Th??ng b??o"}
        handleAction={handleDelete}
        message={`X??c nh???n x??a ?????t ch??? ?`}
      />
    </>
  );
}

function ReservationHistory({ id, owner }) {
  //
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    console.log("Vo6 hay khong ");
    if (checkAll) {
      let map = reservations.content.map((c) => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == reservations?.content?.length) {
        setModel([]);
      }
    }
  }, [checkAll]);

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size]);

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == reservations?.content?.length) setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

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
      name: "Ng?????i d??ng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Nh?? h??ng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "S??? l?????ng",
      field: "star",
      isSortable: true,
    },
    {
      name: "Th???i gian",
      field: "timeComing",
      isSortable: true,
    },
    {
      name: "Ng??y ?????t",
      field: "createdAt",
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
  let query = `${spring.reservation}/type/4/owner/${owner}?page=${page}&size=${size}`;
  if (id != 0) {
    query = `${spring.reservation}/type/4/restaurant/${id}?page=${page}&size=${size}`;
  }
  const { data: reservations, error } = useSWR(query);

  if (!reservations)
    return (
      <>
        <Card>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col></Col>
              <Col className="text-right"></Col>
            </Row>
          </CardHeader>
          <SpringTable
            renderRow={() => <Spinner type="grow" color="primary" />}
            HeaderCommponent={HeaderComponent}
          />
        </Card>
      </>
    );

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow
        reservation={reservation}
        model={model}
        setModel={setModel}
        type={4}
      />
    ));
  };

  const handleDelete = () => {
    reservationService.delete(model).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
        mutate(query);
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col></Col>
            <Col className="text-right"></Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reservations}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />
        </CardFooter>
      </Card>
    </>
  );
}

function RestaurantRow({ restaurant, model, setModel }) {
  const el = [];
  for (let i = 0; i < restaurant.starAverage; i++) {
    el.push(<i className="fas fa-star" style={{ color: "orange" }}></i>);
  }
  return (
    <>
      <tr>
        <td style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              checked={model.includes(restaurant.id)}
              value={restaurant.id}
              onClick={(e) => {
                //handle check one
                if (!model.includes(restaurant.id)) {
                  setModel([...model, restaurant.id]);
                } else {
                  setModel(model.filter((m) => m != restaurant.id));
                }
              }}
            ></input>
          </div>
        </td>
        <td style={{ paddingRight: "0" }}>
          <Link href={"/restaurants/" + restaurant.id}>
            <Button outline color="secondary" className="btn-sm" type="button">
              <i className="fas fa-eye"></i>
            </Button>
          </Link>
        </td>
        <td
          style={{
            maxWidth: "10em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {restaurant.status == 1 && (
            <span className="badge-dot badge badge-">
              <i className="bg-success"></i>??ang ch??? duy???t
            </span>
          )}
          {restaurant.status == 2 && (
            <span className="badge-dot badge badge-">
              <i className="bg-warning"></i>???? duy???t
            </span>
          )}
          {restaurant.status == 3 && (
            <span className="badge-dot badge badge-">
              <i className="bg-warning"></i>???? b??? kh??a
            </span>
          )}
        </td>
        <td
          style={{
            maxWidth: "15rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{restaurant.name}</span>
        </td>
        <td
          style={{
            maxWidth: "15rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{restaurant.address.detail}</span>
        </td>
        <td>{el}</td>
        <td>
          <span className="mb-0">{restaurant.reservationCount}</span>
        </td>
        <td>
          <span className="mb-0">{restaurant.userLikeCount}</span>
        </td>
        <td>
          <span className="mb-0">{restaurant.reviewCount}</span>
        </td>
        <td>
          <span className="mb-0">
            {new Date(restaurant.createdAt).toLocaleString()}
          </span>
        </td>
      </tr>
    </>
  );
}

function Restaurant({ owner }) {
  //
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);

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
      name: "Tr???ng th??i",
      field: "approveStatus",
      isSortable: true,
    },
    {
      name: "Nh?? h??ng",
      field: "name",
      isSortable: true,
    },
    {
      name: "?????a ch???",
      field: "address.detail",
      isSortable: true,
    },
    {
      name: "????nh gi??",
      field: "starAverage",
      isSortable: false,
    },

    {
      name: "L?????t ?????t",
      field: "comment",
      isSortable: false,
    },
    {
      name: "L?????t th??ch",
      field: "createdAt",
      isSortable: false,
    },
    {
      name: "L?????t review",
      field: "createdAt",
      isSortable: false,
    },
    {
      name: "Ng??y ????ng k??",
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
  const HeaderComponent = [];

  useEffect(() => {
    if (checkAll) {
      let map = restaurants.content.map((c) => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == restaurants?.content?.length) {
        setModel([]);
      }
    }
  }, [checkAll]);

  useEffect(() => {
    setCheckAll(false);
    setModel([]);
  }, [size]);

  useEffect(() => {
    // each time model has updated
    // check current model has all checked or not?
    if (model.length == restaurants?.content?.length) setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

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
  const query = `${spring.owner_restaurant}/${owner}`;
  const { data: restaurants, error } = useSWR(query);

  if (!restaurants)
    return (
      <>
        <Card className="shadow" style={{ marginBottom: "1rem" }}>
          <CardHeader className="border-0">
            <Row className="align-items-center"></Row>
          </CardHeader>
          <SpringTable
            renderRow={() => <Spinner type="grow" color="primary" />}
            HeaderCommponent={HeaderComponent}
          />
        </Card>
      </>
    );

  const renderRow = () => {
    return restaurants.content.map((restaurant) => (
      <RestaurantRow
        restaurant={restaurant}
        model={model}
        setModel={setModel}
      />
    ));
  };

  const handleApprove = (type) => {
    restaurantService.bapprove(model, type).then((res) => {
      if (res.status == "update") {
        Alert.showUpdateSuccess();
        mutate(query);
      }
    });
  };

  const handleDelete = () => {
    restaurantService.bdelete(model).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
        mutate(query);
      }
    });
  };

  return (
    <>
      <Card className="shadow" style={{ marginBottom: "1rem" }}>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">Danh s??ch nh?? h??ng</h3>
            </Col>
            <Col className="text-right">
              {model.length > 0 && (
                <Button
                  className="btn btn-warning btn-sm"
                  type="button"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <i
                    className="fas fa-times-circle"
                    style={{ color: "white", paddingRight: "0.5rem" }}
                  ></i>
                  X??a
                </Button>
              )}
            </Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={restaurants}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Th??ng b??o"}
        handleAction={handleDelete}
        message={`X??c nh???n x??a nh?? h??ng ?`}
      />
    </>
  );
}

function Review({ ownerId }) {
  const [selectRestaurantReview, setSelectRestaurantReview] = useState(0);
  const [openedCollapse, setOpenedCollapse] = React.useState("no");
  const restaurantQuery = `${spring.owner_restaurant}/${ownerId}`;
  const { data: restaurants, error: erRestaurants } = useSWR(restaurantQuery);

  const reviewQuery =
    selectRestaurantReview == 0
      ? `${spring.review}/owner/${ownerId}`
      : `${spring.review}/restaurant/${selectRestaurantReview}`;
  const { data: reviews, error: erReviews } = useSWR(reviewQuery);

  const handleChangeRestaurantReview = (e) => {
    let restaurantId = e.target.value;
    setSelectRestaurantReview(restaurantId);
  };

  return (
    <Card
      className="card-profile bg-transparent border-0"
      style={{ marginBottom: "1rem" }}
    >
      <CardHeader className="bg-white shadow">
        <Row className="align-items-center mb-3">
          <select
            className="form-control"
            onChange={handleChangeRestaurantReview}
          >
            <option value={0}>All</option>
            {restaurants?.content?.map((r) => (
              <option value={r.id}>{r.name}</option>
            ))}
          </select>
        </Row>
        <Row
          className="align-items-center"
          aria-expanded={openedCollapse === "collapseTwo"}
          onClick={() =>
            setOpenedCollapse(
              openedCollapse === "collapseTwo" ? "" : "collapseTwo"
            )
          }
        >
          <Col className="col-10">
            <span className="h3 mb-0">Review v??? nh?? h??ng</span>
            <span className="h3 font-weight-300">
              {" "}
              ({reviews?.content?.length})
            </span>
          </Col>
          <Col className="text-right col-2">
            <a className=" w-100 text-primary text-left" color="link">
              <i className="fas fa-chevron-down"></i>
            </a>
          </Col>
        </Row>
      </CardHeader>
      <Collapse
        isOpen={openedCollapse === "collapseTwo"}
        aria-labelledby="headingOne"
        data-parent="#accordionExample"
        id="collapseOne"
      >
        <CardBody className="pt-0 pt-md-4">
          {reviews?.content?.map((review) => (
            <Card className="shadow  mb-3">
              <CardBody>
                <Row className="align-items-center">
                  <Col
                    className="col-auto"
                    style={{ paddingLeft: "0", paddingRight: "0" }}
                  >
                    <a
                      className="avatar avatar-xl rounded-circle"
                      href="javascript:;"
                    >
                      <img
                        src={review.user.avatar}
                        style={{
                          objectFit: "cover",
                          width: "48px",
                          height: "48px",
                        }}
                      ></img>
                    </a>
                  </Col>
                  <div className="col" style={{ paddingRight: "0" }}>
                    <h4 className="mb-0">
                      <Link href={"/reviews/" + review.id}>{review.title}</Link>
                    </h4>
                    <p className="text-sm mb-0" style={{ fontWeight: "bold" }}>
                      {review.restaurant.name}
                    </p>
                    <small className="text-sm text-muted mb-0">
                      {review.restaurant.address.detail}
                    </small>
                  </div>
                </Row>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Collapse>
    </Card>
  );
}

function UploadAvatar({ model, method }) {
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
    <div>
      {(model.logo || model.logoUrl) && (
        <img
          className="rounded-circle"
          width="160px"
          height="160px"
          src={model.logo?.preview ?? model.logoUrl}
          onClick={() => document.getElementById("avt").click()}
        />
      )}
      <input id="avt" {...getInputProps()} />
    </div>
  );
}

function OwnerDetail() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [id, setId] = useState();
  const [isEdit, setIsEdit] = React.useState(false);
  const [isEditTag, setIsEditTag] = React.useState(false);
  const [openedCollapse, setOpenedCollapse] = React.useState("no");
  const [modalFormOpen, setModalFormOpen] = React.useState(false);
  const [hTabsIcons, setHTabsIcons] = React.useState("hTabsIcons-1");
  const [selectRestaurant, setSelectRestaurant] = useState(0);
  const [avt, setAvt] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Data fetching

  useEffect(() => {
    const authId = localStorage.getItem("authId");
    setId(authId);
  }, []);

  console.log("QUERY");
  const query = `${spring.owner}/${id}`;
  console.log(query);
  const { data: user, error: erOwnerInfo } = useSWR(query);

  const restaurantQuery = `${spring.owner_restaurant}/${id}`;
  const { data: restaurants, error: erRestaurants } = useSWR(restaurantQuery);

  useEffect(() => {
    if (user) {
      setAvt({
        ...avt,
        logoUrl: user.avatar,
      });
    }
  }, [user]);

  if (!user || !restaurants)
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
            <Card
              className="card-profile shadow"
              style={{ marginBottom: "1rem", width: "100%" }}
            >
              <Row
                className="justify-content-center"
                style={{ marginBottom: "2rem" }}
              >
                <div className="order-lg-2 col-lg-3">
                  <div className="card-profile-image">
                    <Spinner type="grow" color="primary" />
                  </div>
                </div>
              </Row>
              <CardBody className="pt-0 pt-md-4">
                <Spinner type="grow" color="primary" />
              </CardBody>
            </Card>
          </Row>
        </Container>
      </>
    );

  const handleEditInfor = (infor) => {
    setIsEdit(false);
    if(avt.logo) {
      //new avatar
      const newAvatar = imageService.getNewImage(avt.logo).then(res => {
        const data = {
          ...infor,
          avatar: res.data,
          id: id,
        };

        ownerService.editInfor(data).then((res) => {
          if (res.status == "update") {
            Alert.showUpdateSuccess();
            mutate(query);
          }
        });

      });
    } else {
      const data = {
        ...infor,
        id: id,
      };

      ownerService.editInfor(data).then((res) => {
        if (res.status == "update") {
          Alert.showUpdateSuccess();
          mutate(query);
        }
      });
    }
  };

  const handleChangeRestaurant = (e) => {
    let restaurantId = e.target.value;
    setSelectRestaurant(restaurantId);
  };

  const handleApprove = (type) => {
    ownerService.bulkApprove([id], type).then((res) => {
      if (res.status == "update") {
        Alert.showUpdateSuccess();
        mutate(query);
      }
    });
  };

  const handleDeleteOwner = () => {
    ownerService.bulkDelete([id]).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess().then(() => {
          authService.logout();
          router.push("/login");
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
        <Row>
          <div className="order-xl-2 mb-5 mb-xl-0 col-xl-4">
            <Card
              className="card-profile shadow"
              style={{ marginBottom: "1rem" }}
            >
              <Row
                className="justify-content-center"
                style={{ marginBottom: "2rem" }}
              >
                <div className="order-lg-2 col-lg-3">
                  <div className="card-profile-image">
                    {!isEdit && (
                      <a>
                        <img
                          className="rounded-circle"
                          src={user.avatar}
                          width="160px"
                          height="160px"
                        ></img>
                      </a>
                    )}
                    {isEdit && <UploadAvatar model={avt} method={setAvt} />}
                  </div>
                </div>
              </Row>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <Col>
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">{user.restaurantCount}</span>
                        <span className="description">Nh?? h??ng</span>
                      </div>
                      <div>
                        <span className="heading">{user.reservationCount}</span>
                        <span className="description">S??? l?????ng ?????t ch???</span>
                      </div>
                      <div>
                        {user.status == 1 && (
                          <span
                            className="heading"
                            style={{
                              fontSize: ".875rem",
                              textTransform: "none",
                            }}
                          >
                            Ch??? duy???t
                          </span>
                        )}
                        {user.status == 2 && (
                          <span
                            className="heading"
                            style={{
                              fontSize: ".875rem",
                              textTransform: "none",
                            }}
                          >
                            ???? duy???t
                          </span>
                        )}
                        {user.status == 3 && (
                          <span
                            className="heading"
                            style={{
                              fontSize: ".875rem",
                              textTransform: "none",
                            }}
                          >
                            ???? t??? ch???i
                          </span>
                        )}
                        <span className="description">Tr???ng th??i</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-right">
                    <Button
                      className="btn btn-warning btn-sm"
                      type="button"
                      onClick={() => setModalOpen(!modalOpen)}
                    >
                      <i
                        className="fas fa-times-circle"
                        style={{ color: "white", paddingRight: "0.5rem" }}
                      ></i>
                      X??a
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Review ownerId={id} key={"review" + id} />
          </div>
          <div className="order-xl-1 col-xl-8">
            <Card
              className="bg-secondary shadow"
              style={{ marginBottom: "1rem" }}
              aria-expanded={openedCollapse === "collapseInfo"}
            >
              <Form onSubmit={handleSubmit(handleEditInfor)}>
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col
                      className="col-8"
                      onClick={() =>
                        setOpenedCollapse(
                          openedCollapse === "collapseInfo"
                            ? ""
                            : "collapseInfo"
                        )
                      }
                    >
                      <h3 className="mb-0">Th??ng tin ng?????i d??ng</h3>
                    </Col>
                    <Col className="text-right col-4">
                      {!isEdit && (
                        <Button
                          outline
                          color="secondary"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEdit(true);
                          }}
                        >
                          <i
                            className="fas fa-1x fa-edit"
                            style={{ color: "green" }}
                          ></i>
                        </Button>
                      )}
                      {isEdit && (
                        <Button outline color="secondary" type="submit">
                          <i
                            className="fas fa-check-circle"
                            style={{ color: "green" }}
                          ></i>
                        </Button>
                      )}
                    </Col>
                  </Row>
                </CardHeader>
                <Collapse
                  isOpen={openedCollapse === "collapseInfo"}
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                  id="collapseInfo"
                >
                  <CardBody>
                    <div className="pl-lg-4">
                      <Row>
                        <Col className="col-lg-6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="username"
                            >
                              Username
                            </label>
                            <input
                              readOnly={true}
                              id="username"
                              defaultValue={user.username}
                              type="text"
                              className="form-control-alternative form-control"
                            ></input>
                          </FormGroup>
                        </Col>
                        <Col className="col-lg-6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="email"
                            >
                              Email
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="email"
                              defaultValue={user.email}
                              type="email"
                              className="form-control-alternative form-control"
                              {...register("email")}
                            ></input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="col-lg-6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="fullname"
                            >
                              T??n hi???n th???
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="fullname"
                              defaultValue={user.fullName}
                              type="text"
                              className="form-control-alternative form-control"
                              {...register("fullName")}
                            ></input>
                          </FormGroup>
                        </Col>
                        <Col className="col-lg-6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="phonenumber"
                            >
                              S??? ??i???n tho???i
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="phonenumber"
                              defaultValue={user.phone}
                              type="number"
                              className="form-control-alternative form-control"
                              {...register("phone")}
                            ></input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="col-lg-6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="fullname"
                            >
                              Ng??y sinh
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="birthday"
                              type="date"
                              defaultValue={user.dob}
                              className="form-control-alternative form-control"
                              {...register("dob")}
                            ></input>
                          </FormGroup>
                        </Col>
                        <Col className="col-lg-6">
                          <FormGroup>
                            <p className="form-control-label">Gi???i t??nh</p>
                            <FormGroup check inline>
                              <Label check>
                                <input
                                  type="radio"
                                  name="gender"
                                  value={1}
                                  defaultChecked={user.gender == 1}
                                  {...register("gender")}
                                ></input>{" "}
                                Nam
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <input
                                  type="radio"
                                  name="gender"
                                  value={2}
                                  defaultChecked={user.gender == 2}
                                  {...register("gender")}
                                ></input>{" "}
                                N???
                              </Label>
                            </FormGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="col-md-12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="fullname"
                            >
                              ?????a ch???
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="address"
                              defaultValue={
                                user.address ? user.address.detail : null
                              }
                              type="text"
                              className="form-control-alternative form-control"
                              {...register("addressDetail")}
                            ></input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Collapse>
              </Form>
            </Card>
            <Restaurant owner={id}></Restaurant>
            <Card
              className="bg-secondary shadow"
              style={{ marginBottom: "1rem" }}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col className="col-6">
                    <h3 className="mb-0">Danh s??ch ?????t ch???</h3>
                  </Col>
                  <Col className="text-right col-6">
                    <select
                      className="form-control"
                      onChange={handleChangeRestaurant}
                    >
                      <option value={0}>All</option>
                      {restaurants?.content.map((r) => (
                        <option value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody style={{ padding: "0!important" }}>
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
                        Ch??? x??c nh???n
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
                        ???? ?????t ch???
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
                        ???? h???y
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={
                          "mb-sm-3 mb-md-0 " +
                          (hTabsIcons === "hTabsIcons-5" ? "active" : "")
                        }
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setHTabsIcons("hTabsIcons-5");
                        }}
                      >
                        <i className="ni ni-calendar-grid-58 mr-2"></i>
                        L???ch s???
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
                        ????nh gi??
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>

                <TabContent id="myTabContent" activeTab={hTabsIcons}>
                  <TabPane tabId="hTabsIcons-1" role="tabpanel">
                    <ReservationWaitApprove id={selectRestaurant} owner={id} />
                  </TabPane>
                  <TabPane tabId="hTabsIcons-2" role="tabpanel">
                    <ReservationApproved id={selectRestaurant} owner={id} />
                  </TabPane>
                  <TabPane tabId="hTabsIcons-3" role="tabpanel">
                    <ReservationCanceled id={selectRestaurant} owner={id} />
                  </TabPane>
                  <TabPane tabId="hTabsIcons-5" role="tabpanel">
                    <ReservationHistory id={selectRestaurant} owner={id} />
                  </TabPane>
                  <TabPane tabId="hTabsIcons-4" role="tabpanel">
                    <Comment restaurantId={selectRestaurant} ownerId={id} />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      {/* Modal */}
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Th??ng b??o"}
        handleAction={() => {
          handleDeleteOwner;
        }}
        message={`X??c nh???n x??a ch??? nh?? h??ng ?`}
      />
    </>
  );
}

OwnerDetail.layout = AdminLayout;
OwnerDetail.title = "C?? nh??n";

export default OwnerDetail;
