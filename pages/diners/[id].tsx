import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
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
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Spinner,
  TabPane,
} from "reactstrap";
import useSWR, { mutate } from "swr";
import AdminLayout from "../../layouts/AdminLayout";
import spring from "../../springRoute";
import { SpringPagination, SpringTable } from "../../components/SpringTable";
import reservationService from "../../services/reservationService";
import reviewService from "../../services/reviewService";
import reactionService from "../../services/reactionService";
import userService from "../../services/userService";
import ConfirmModal from "../../components/ConfirmModal";
import { useForm } from "react-hook-form";
import mlService from "../../services/mlService";
import Alert from "../../components/Alert2";

const reservationType = {
  WAITING: 1,
  APPROVE: 2,
  CANCEL: 3,
  HISTORY: 4
}

const reactionType = {
  LIKE: 1,
  UNLIKE: 2
}

const revalidate = (id, page, size) => {
  mutate(`${spring.reservation}/type/1/user/${id}?page=${page}&size=${size}`)
  mutate(`${spring.reservation}/type/2/user/${id}?page=${page}&size=${size}`)
  mutate(`${spring.reservation}/type/3/user/${id}?page=${page}&size=${size}`)
  mutate(`${spring.reservation}/type/4/user/${id}?page=${page}&size=${size}`)
}

function CommentRow({ comment, model, setModel }) {
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
              checked={model.includes(comment.id)}
              value={comment.id}
              onClick={(e) => {
                //handle check one
                if (!model.includes(comment.id)) {
                  setModel([
                    ...model,
                    comment.id
                  ]);
                }
                else {
                  setModel(model.filter(m => m != comment.id))
                }
              }}
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
        <td
          style={{
            maxWidth: "20em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">
            {comment.restaurant.name}
          </span>
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
          <span className="mb-0">
            {comment.content}
          </span>
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

function Comment() {
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  // Check All
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  //Headers
  const headers = [
    {
      name: "",
      field: "checkbox",
      isSortable: false,
    },
    {
      name: "Ngày đăng",
      field: "createdAt",
      isSortable: true,
    },
    {
      name: "Nhà hàng",
      field: "restaurant.name",
      isSortable: true,
    },
    {
      name: "Đánh giá",
      field: "star",
      isSortable: true,
    },
    {
      name: "Bình luận",
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
  const query = `${spring.comment}/user/3?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  const { data: comments, error } = useSWR(query);

  const renderRow = () => {
    return comments.content.map((comment) => (
      <CommentRow comment={comment} model={model} setModel={setModel} />
    ))
  }

  useEffect(() => {
    if (checkAll) {
      let map = comments.content.map(c => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == comments?.content?.length) {
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
    if (model.length == comments?.content?.length)
      setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

  if (!comments)
    return (

      <>
        <Card className="shadow" style={{ marginBottom: "1rem" }}>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Bình luận của người dùng</h3>
              </Col>
              <Col className="text-right">
              </Col>
            </Row>
          </CardHeader>
          <SpringTable renderRow={() => <Spinner type="grow" color="primary" />} HeaderCommponent={HeaderComponent} />
        </Card>
      </>
    );

  return (
    <>
      <Card className="shadow" style={{ marginBottom: "1rem" }}>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">Bình luận của người dùng</h3>
            </Col>
            <Col className="text-right">
              {model.length > 0 && <Button
                className="btn btn-warning btn-sm"
                type="button"
                onClick={() => setModalOpen(!modalOpen)}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Xóa
              </Button>}
            </Col>
          </Row>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={comments}
            setPage={setPage}
            size={size}
            setSize={setSize} />
        </CardFooter>
      </Card>

      {/* Modal */}
      <ConfirmModal modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={() => { }}
        message={`Xác nhận xóa bình luận ?`} />
    </>
  );
}


function ReviewRow({ review, handleDelete }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  return (
    <>
      <tr>
        <td>
          <span className="mb-0">
            {new Date(review.createdAt).toLocaleString()}
          </span>
        </td>
        <th
          style={{
            maxWidth: "19rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">
            {review.title}
          </span>
        </th>
        <td
          style={{
            maxWidth: "15rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{review.restaurant.name}</span>
        </td>
        <td>
          <span className="mb-0">{review.point}</span>
        </td>
        <td>
          <span className="mb-0">{review.countUserLike}</span>
        </td>
        <td>
          <Row>
            <Col className="col-6">
              <Link href={"/reviews/" + review.id}>
                <Button
                  outline
                  color="secondary"
                  className="btn-sm"
                  type="button"
                  style={{ marginRight: "2rem" }}
                >
                  <i className="fas fa-eye"></i>
                </Button>
              </Link>
            </Col>
            <Col className="col-6">
              <Button
                className="btn-sm"
                outline
                color="secondary"
                type="button"
                onClick={() => setModalOpen(!modalOpen)}
              >
                <i className="fas fa-times-circle" style={{ color: "red" }}></i>
              </Button>
            </Col>
          </Row>
        </td>
      </tr>
      {/* Modal */}
      <ConfirmModal modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={() => handleDelete(review.id)}
        message={`Xác nhận xóa bài review ?`} />
    </>
  );
}

function Review({ id }) {
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "",
    direction: "ASC",
  });

  //Headers
  const headers = [
    {
      name: "Ngày đăng",
      field: "createdAt",
      isSortable: false,
    },
    {
      name: "Tiêu đề",
      field: "title",
      isSortable: true,
      sortOrder: 0,
    },
    {
      name: "Nhà hàng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Điểm",
      field: "point",
      isSortable: true,
    },
    {
      name: "Lượt thích",
      field: "userLike",
      isSortable: false,
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
  const query = `${spring.review}/user/${id}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  const { data: reviews, error } = useSWR(query);

  if (!reviews)
    return (
      <>
        <Card className="shadow" style={{ marginBottom: "1rem" }}>
          <CardHeader className="border-0">
            <h3 className="mb-0">Review của người dùng</h3>
          </CardHeader>
          <SpringTable renderRow={() => <Spinner type="grow" color="primary" />} HeaderCommponent={HeaderComponent} />
          <CardFooter>
          </CardFooter>
        </Card>
      </>
    );

  const handleDelete = (id) => {
    reviewService.delete(id).then(res => {
      if(res.status == 'update') {
        Alert.showDeleteSuccess();
      } else Alert.showError();
      mutate(query)
    })
  }


  const renderRow = () => {
    return reviews.content.map((review) => (
      <ReviewRow review={review} handleDelete={handleDelete} />
    ))
  }


  return (
    <>
      <Card className="shadow" style={{ marginBottom: "1rem" }}>
        <CardHeader className="border-0">
          <h3 className="mb-0">Review của người dùng</h3>
        </CardHeader>
        <SpringTable renderRow={renderRow} HeaderCommponent={HeaderComponent} />
        <CardFooter>
          <SpringPagination
            model={reviews}
            setPage={setPage}
            size={size}
            setSize={setSize} />
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
            {reservation.voucher?.code}
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

function ReservationWaitApprove() {
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
      name: "Nhà hàng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Số lượng",
      field: "star",
      isSortable: true,
    },
    {
      name: "Thời gian",
      field: "comment",
      isSortable: true,
    },

    {
      name: "Ưu đãi",
      field: "comment",
      isSortable: true,
    },
    {
      name: "Ngày đặt",
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
  const router = useRouter();
  const { id } = router.query;
  const query = `${spring.reservation}/type/1/user/${id}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  const { data: reservations, error } = useSWR(query);

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


  if (!reservations)
    return (
      <>
        <Row>
          <div className="col">
            <p>Loading...</p>
          </div>
        </Row>
      </>
    );

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow reservation={reservation} model={model} setModel={setModel} type={1} />
    ))
  }

  const handleApprove = (type) => {
    console.log(model);
    reservationService.approve(model, type).then(res => {
      if(res.status == 'update') {
        Alert.showUpdateSuccess();
      } else Alert.showError();
      revalidate(id, page, size)
    });
  }

  const handleDelete = () => {
    reservationService.delete(model).then(res => {
      if(res.status == 'update') {
        Alert.showDeleteSuccess();
      } else Alert.showError();

      mutate(query);
    })
  }

  return (
    <>
      <Card className="shadow" style={{ marginBottom: "1rem" }}>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">Danh sách đặt chỗ</h3>
            </Col>
            <Col className="text-right">
              <Button className="btn btn-sm" color="success" type="button"
                onClick={() => handleApprove(reservationType.APPROVE)}>
                <i
                  className="fas fa-thumbs-up"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Xác nhận
              </Button>
              <Button className="btn btn-sm" color="default" type="button"
                onClick={() => handleApprove(reservationType.CANCEL)}>
                <i
                  className="fas fa-thumbs-down"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Từ chối
              </Button>
              {model.length > 0 && <Button
                className="btn btn-warning btn-sm"
                type="button"
                onClick={() => setModalOpen(!modalOpen)}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Xóa
              </Button>}
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

function ReservationApproved() {
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
      name: "Nhà hàng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Số lượng",
      field: "star",
      isSortable: true,
    },
    {
      name: "Thời gian",
      field: "comment",
      isSortable: true,
    },

    {
      name: "Ưu đãi",
      field: "comment",
      isSortable: true,
    },
    {
      name: "Ngày đặt",
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
  const router = useRouter();
  const { id } = router.query;
  const query = `${spring.reservation}/type/2/user/${id}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  const { data: reservations, error } = useSWR(query);

  useEffect(() => {
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

  if (!reservations)
    return (
      <>
        <Row>
          <div className="col">
            <p>Loading...</p>
          </div>
        </Row>
      </>
    );

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow reservation={reservation} model={model} setModel={setModel} type={2} />
    ))
  }

  const handleApprove = (type) => {
    console.log(model);
    reservationService.approve(model, type).then(res => {
      if(res.status == 'update') {
        Alert.showUpdateSuccess();
      } else Alert.showError();
      revalidate(id, page, size)
    });
  }

  const handleDelete = () => {
    reservationService.delete(model).then(res => {
      console.log("xóa thành công");
      if(res.status == 'update') {
        Alert.showDeleteSuccess();
      } else Alert.showError();

      mutate(query);
    })
  }

  return (
    <>
      <Card className="shadow" style={{ marginBottom: "1rem" }}>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">Danh sách đặt chỗ</h3>
            </Col>
            <Col className="text-right">
              <Button className="btn btn-sm" color="success" type="button"
                onClick={() => handleApprove(reservationType.HISTORY)}>
                <i
                  className="fas fa-thumbs-up"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Hoàn tất
              </Button>
              <Button className="btn btn-sm" color="default" type="button"
                onClick={() => handleApprove(reservationType.CANCEL)}>
                <i
                  className="fas fa-thumbs-down"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Hủy đặt chỗ
              </Button>
              {model.length > 0 && <Button
                className="btn btn-warning btn-sm"
                type="button"
                onClick={() => setModalOpen(!modalOpen)}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Xóa
              </Button>}
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
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className=" modal-header">
          <h5 className=" modal-title" id="confirmDeleted">
            Thông báo
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody>Bạn có muốn xóa đơn đặt chỗ này không?</ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Hủy
          </Button>
          <Button color="primary" type="button">
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

function ReservationCanceled() {
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
      name: "Nhà hàng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Số lượng",
      field: "star",
      isSortable: true,
    },
    {
      name: "Thời gian",
      field: "comment",
      isSortable: true,
    },

    {
      name: "Ưu đãi",
      field: "comment",
      isSortable: true,
    },
    {
      name: "Ngày đặt",
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
  const router = useRouter();
  const { id } = router.query;
  const query = `${spring.reservation}/type/3/user/${id}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  const { data: reservations, error } = useSWR(query);

  useEffect(() => {
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

  if (!reservations)
    return (
      <>
        <Card className="shadow" style={{ marginBottom: "1rem" }}>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Danh sách đặt chỗ</h3>
              </Col>
              <Col className="text-right">
              </Col>
            </Row>
          </CardHeader>
          <SpringTable renderRow={() => <Spinner type="grow" color="primary" />} HeaderCommponent={HeaderComponent} />
          <CardFooter>
          </CardFooter>
        </Card>
      </>
    );

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow reservation={reservation} model={model} setModel={setModel} type={3} />
    ))
  }

  const handleDelete = () => {
    reservationService.delete(model).then(res => {
      if(res.status == 'update') {
        Alert.showDeleteSuccess();
      } else Alert.showError();

      mutate(query);
    })
  }

  return (
    <>
      <Card className="shadow" style={{ marginBottom: "1rem" }}>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">Danh sách đặt chỗ</h3>
            </Col>
            <Col className="text-right">
              {model.length > 0 && <Button
                className="btn btn-warning btn-sm"
                type="button"
                onClick={() => setModalOpen(!modalOpen)}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Xóa
              </Button>}
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

function ReservationHistory() {
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
      name: "Nhà hàng",
      field: "restaurant",
      isSortable: true,
    },
    {
      name: "Số lượng",
      field: "star",
      isSortable: true,
    },
    {
      name: "Thời gian",
      field: "comment",
      isSortable: true,
    },

    {
      name: "Ưu đãi",
      field: "comment",
      isSortable: true,
    },
    {
      name: "Ngày đặt",
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
  const router = useRouter();
  const { id } = router.query;
  const query = `${spring.reservation}/type/4/user/${id}?page=${page}&size=${size}`;
  const { data: reservations, error } = useSWR(query);

  useEffect(() => {
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

  if (!reservations)
    return (
      <>
        <Card className="shadow" style={{ marginBottom: "1rem" }}>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Danh sách đặt chỗ</h3>
              </Col>
              <Col className="text-right">
              </Col>
            </Row>
          </CardHeader>
          <SpringTable renderRow={() => <Spinner type="grow" color="primary" />} HeaderCommponent={HeaderComponent} />
          <CardFooter>
          </CardFooter>
        </Card>
      </>
    );

  const renderRow = () => {
    return reservations.content.map((reservation) => (
      <ReservationRow reservation={reservation} model={model} setModel={setModel} type={4} />
    ))
  }

  const handleDelete = () => {
    reservationService.delete(model).then(res => {
      if(res.status == 'update') {
        Alert.showDeleteSuccess();
      } else Alert.showError();

      mutate(query);
    })
  }

  return (
    <>
      <Card className="shadow" style={{ marginBottom: "1rem" }}>
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">Danh sách đặt chỗ</h3>
            </Col>
            <Col className="text-right">
              {model.length > 0 && <Button
                className="btn btn-warning btn-sm"
                type="button"
                onClick={() => setModalOpen(!modalOpen)}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ color: "white", paddingRight: "0.5rem" }}
                ></i>
                Xóa
              </Button>}
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

function CustomerDetail() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isEditTag, setIsEditTag] = React.useState(false);
  const [profile, setProfile] = useState([]);
  const [activeArea, setActiveArea] = useState([]);
  const [openedCollapse, setOpenedCollapse] = React.useState("no");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [modalFormOpen, setModalFormOpen] = React.useState(false);
  const [hTabsIcons, setHTabsIcons] = React.useState("hTabsIcons-1");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { id } = router.query;
  const query = `${spring.diner}/${id}`;

  const { data: dinner, error: eDinner } = useSWR(query);
  const { data: resource, error: eResource } = useSWR(spring.resource);

  useEffect(() => {
    if (dinner) {
      setProfile(dinner.favoriteTags.map(t => t.id))
      //
      let activeAreas: string[] = dinner?.activeAreaIds?.split('&');
      setActiveArea(activeAreas ?? [])
    }
  }, [dinner]);

  if (!dinner || !resource)
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
            <div className="order-xl-2 mb-5 mb-xl-0 col-xl-3">
              <Card
                className="card-profile shadow"
                style={{ marginBottom: "1rem" }}
              >
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
            </div>
            <div className="order-xl-1 col-xl-9">
              <Card
                className="bg-secondary shadow"
                style={{ marginBottom: "1rem" }}
                aria-expanded={openedCollapse === "collapseInfo"}
              >
                <Form>
                  <CardHeader className="bg-white border-0"
                  >
                    <Row className="align-items-center">
                      <Col className="col-8"
                        onClick={() =>
                          setOpenedCollapse(
                            openedCollapse === "collapseInfo" ? "" : "collapseInfo"
                          )
                        }>
                        <h3 className="mb-0">Thông tin người dùng</h3>
                      </Col>
                      <Col className="text-right col-4">
                        {!isEdit && (
                          <Button
                            outline
                            color="secondary"
                            type="button"
                            onClick={() => setIsEdit(true)}
                          >
                            <i
                              className="fas fa-1x fa-edit"
                              style={{ color: "green" }}
                            ></i>
                          </Button>
                        )}
                        {isEdit && (
                          <Button
                            outline
                            color="secondary"
                            type="submit"
                          >
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
                      <Spinner type="grow" color="primary" />
                    </CardBody>
                  </Collapse>
                </Form>
              </Card>
              <Review id={id} />
              <div className="nav-wrapper">
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
                      Đánh giá
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>

              <TabContent id="myTabContent" activeTab={hTabsIcons}>
                <TabPane tabId="hTabsIcons-1" role="tabpanel">
                  <ReservationWaitApprove />
                </TabPane>
                <TabPane tabId="hTabsIcons-2" role="tabpanel">
                  <ReservationApproved />
                </TabPane>
                <TabPane tabId="hTabsIcons-3" role="tabpanel">
                  <ReservationCanceled />
                </TabPane>
                <TabPane tabId="hTabsIcons-4" role="tabpanel">
                  <Comment></Comment>
                </TabPane>
              </TabContent>
            </div>
          </Row>
        </Container>
      </>
    );

  console.log(dinner);

  const reaction = (reviewId, userId, type) => {
    reactionService.review(userId, reviewId, type).then(res => {
      if(res.status == 'update') {
        Alert.showUpdateSuccess();
      } else Alert.showError();
      mutate(query)
    });
  }

  const reaction2 = (restaurantId, userId, type) => {
    reactionService.restaurant(userId, restaurantId, type).then(res => {
      if(res.status == 'update') {
        Alert.showUpdateSuccess();
      } else Alert.showError();
      mutate(query)
    });
  }

  const handleEditInfor = (infor) => {
    setIsEdit(false);
    const data = {
      ...infor,
      id: id
    }
    console.log("INFROROR")
    console.log(data);

    userService.editInfor(data).then(res => {
      if(res.status == 'update') {
        Alert.showUpdateSuccess();
      } else Alert.showError();
      mutate(query)
    })

  }

  const handlePickProfile = (e, id) => {
    if (!profile.includes(id)) {
      setProfile([
        ...profile,
        id
      ])
    } else {
      let profs = profile.filter(p => p.id != id);
      console.log(profs)
      setProfile([
        ...profs
      ])
    }
  }

  const handleEditProfile = () => {

    userService.updateProfile(activeArea, profile, dinner.id).then(res => {
      mlService.updateProfileDistance(activeArea, profile, dinner.id)
      if(res.status == 'update') {
        Alert.showUpdateSuccess();
      } else Alert.showError();
      mutate(query)
    })
    setIsEdit(false);
  }

  const handlePickArea = (e, id) => {
    if (e.target.checked) {
      console.log("VOKO")
      setActiveArea([...activeArea, id])
    } else {
      setActiveArea(activeArea.filter(a => a != id))
    }
  }

  const FavoriteRestaurant = [];
  const FavoriteReview = [];
  dinner.favoriteRestaurant.forEach(r => FavoriteRestaurant.push(
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
                src={r.logo}
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
              <Link href={"/reviews/" + r.id}>{r.name}</Link>
            </h4>
            <p className="text-sm text-muted mb-0">{r.address.detail}</p>
          </div>
          <Col className="col-auto">
            <Button color="primary" size="sm" type="button"
              onClick={() => reaction2(r.id, dinner.id, reactionType.UNLIKE)}>
              <i className="fas fa-heart"></i>
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  ));
  dinner.favoriteReview.forEach(r => FavoriteReview.push(
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
              src={r.restaurant.logo}
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
            <Link href={"/reviews/" + r.id}>
              {r.title}
            </Link>
          </h4>
          <p
            className="text-sm mb-0"
            style={{ fontWeight: "bold" }}
          >
            {r.restaurant.name}
          </p>
          <small className="text-sm text-muted mb-0">
            {r.restaurant.address.detail}
          </small>
        </div>
        <Col className="col-auto">
          <Button color="primary" size="sm" type="button"
            onClick={() => reaction(r.id, dinner.id, reactionType.UNLIKE)}>
            <i className="fas fa-heart"></i>
          </Button>
        </Col>
      </Row>
    </CardBody>
  ));

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
          <div className="order-xl-2 mb-5 mb-xl-0 col-xl-3">
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
                    <a>
                      <img
                        className="rounded-circle"
                        src={dinner.avatar}
                        width="160px"
                        height="160px"
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
                        <span className="heading">{dinner.reviewCount}</span>
                        <span className="description">Review</span>
                      </div>
                      <div>
                        <span className="heading">{dinner.reservationCount}</span>
                        <span className="description">Đặt chỗ</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col className="col-8">
                    <h3 className="mb-0">Sở thích</h3>
                  </Col>
                  <Col className="text-right col-4">
                    {!isEditTag && (
                      <Button
                        outline
                        color="secondary"
                        type="button"
                        onClick={() => setModalFormOpen(true)}
                      >
                        <i
                          className="fas fa-1x fa-edit"
                          style={{ color: "green" }}
                        ></i>
                      </Button>
                    )}
                    {isEditTag && (
                      <Button
                        outline
                        color="secondary"
                        type="button"
                        onClick={handleEditProfile}
                      >
                        <i
                          className="fas fa-check-circle"
                          style={{ color: "green" }}
                        ></i>
                      </Button>
                    )}
                  </Col>
                </Row>
                <Row
                  className="align-items-center"
                  style={{ marginTop: "1rem" }}
                >
                  {dinner.favoriteTags.map(t => (
                    <span
                      className="badge badge-pill badge-light"
                      style={{
                        color: "#32325d",
                        marginLeft: "1rem",
                        marginBottom: "0.5rem",
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: "normal",
                      }}
                    >
                      {t.name}
                    </span>
                  ))}
                  {dinner?.activeAreaIds?.split('&').map(a => (
                    <span
                      className="badge badge-pill badge-light"
                      style={{
                        color: "#32325d",
                        marginLeft: "1rem",
                        marginBottom: "0.5rem",
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: "normal",
                      }}
                    >
                      {resource[0].child.find(r => r.id == a).name}
                    </span>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </div>
          <div className="order-xl-1 col-xl-9">
            <Card
              className="bg-secondary shadow"
              style={{ marginBottom: "1rem" }}
              aria-expanded={openedCollapse === "collapseInfo"}
            >
              <Form onSubmit={handleSubmit(handleEditInfor)}>
                <CardHeader className="bg-white border-0"
                >
                  <Row className="align-items-center">
                    <Col className="col-8"
                      onClick={() =>
                        setOpenedCollapse(
                          openedCollapse === "collapseInfo" ? "" : "collapseInfo"
                        )
                      }>
                      <h3 className="mb-0">Thông tin người dùng</h3>
                    </Col>
                    <Col className="text-right col-4">
                      {!isEdit && (
                        <Button
                          outline
                          color="secondary"
                          type="button"
                          onClick={() => setIsEdit(true)}
                        >
                          <i
                            className="fas fa-1x fa-edit"
                            style={{ color: "green" }}
                          ></i>
                        </Button>
                      )}
                      {isEdit && (
                        <Button
                          outline
                          color="secondary"
                          type="submit"
                        >
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
                              defaultValue={dinner.username}
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
                              defaultValue={dinner.email}
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
                              Tên hiển thị
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="fullname"
                              defaultValue={dinner.fullName}
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
                              Số điện thoại
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="phonenumber"
                              defaultValue={dinner.phone}
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
                              Ngày sinh
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="birthday"
                              type="date"
                              defaultValue={dinner.dob}
                              className="form-control-alternative form-control"
                              {...register("dob")}
                            ></input>
                          </FormGroup>
                        </Col>
                        <Col className="col-lg-6">
                          <FormGroup>
                            <p className="form-control-label">Giới tính</p>
                            <FormGroup check inline>
                              <Label check>
                                <input

                                  type="radio"
                                  name="gender"
                                  value='1'
                                  defaultChecked={dinner.gender == 1}
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
                                  value='2'
                                  defaultChecked={dinner.gender == 2}
                                  {...register("gender")}
                                ></input>{" "}
                                Nữ
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
                              Địa chỉ
                            </label>
                            <input
                              readOnly={!isEdit}
                              id="address"
                              defaultValue={dinner.address.detail}
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
            <Review id={id} />

            <div className="nav-wrapper">
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
                    Đánh giá
                  </NavLink>
                </NavItem>
              </Nav>
            </div>

            <TabContent id="myTabContent" activeTab={hTabsIcons}>
              <TabPane tabId="hTabsIcons-1" role="tabpanel">
                <ReservationWaitApprove />
              </TabPane>
              <TabPane tabId="hTabsIcons-2" role="tabpanel">
                <ReservationApproved />
              </TabPane>
              <TabPane tabId="hTabsIcons-3" role="tabpanel">
                <ReservationCanceled />
              </TabPane>
              <TabPane tabId="hTabsIcons-4" role="tabpanel">
                <ReservationHistory />
              </TabPane>
              <TabPane tabId="hTabsIcons-5" role="tabpanel">
                <Comment></Comment>
              </TabPane>
            </TabContent>

            <Row>
              {/* restaurant like*/}
              <Col className="col-6">
                <Card
                  className="card-profile bg-transparent border-0"
                  style={{ marginBottom: "1rem" }}
                >
                  <CardHeader
                    className="bg-white shadow"
                    aria-expanded={open1}
                    onClick={() =>
                      setOpen1(!open1)
                    }
                  >
                    <Row className="align-items-center">
                      <Col className="col-10">
                        <span className="h3 mb-0">Nhà hàng yêu thích</span>
                        <span className="h3 font-weight-300"> ({FavoriteRestaurant.length})</span>
                      </Col>
                      <Col className="text-right col-2">
                        <a className=" w-100 text-primary text-left" color="link">
                          <i className="fas fa-chevron-down"></i>
                        </a>
                      </Col>
                    </Row>
                  </CardHeader>
                  <Collapse
                    isOpen={open1}
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                    id="collapseOne"
                  >
                    <CardBody className="pt-0 pt-md-4">
                      {FavoriteRestaurant}
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>
              {/*Review like */}
              <Col className="col-6">
                <Card
                  className="card-profile bg-transparent border-0"
                  style={{ marginBottom: "1rem" }}
                >
                  <CardHeader
                    className="bg-white shadow"
                    aria-expanded={openedCollapse === "collapseTwo"}
                    onClick={() =>
                      setOpen2(!open2)
                    }
                  >
                    <Row className="align-items-center">
                      <Col className="col-10">
                        <span className="h3 mb-0">Review yêu thích</span>
                        <span className="h3 font-weight-300"> ({FavoriteReview.length})</span>
                      </Col>
                      <Col className="text-right col-2">
                        <a className=" w-100 text-primary text-left" color="link">
                          <i className="fas fa-chevron-down"></i>
                        </a>
                      </Col>
                    </Row>
                  </CardHeader>
                  <Collapse
                    isOpen={open2}
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                    id="collapseOne"
                  >
                    <CardBody className="pt-0 pt-md-4">
                      <Card className="shadow  mb-3">
                        {FavoriteReview}
                      </Card>
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>
            </Row>
          </div>
        </Row>
      </Container>
      {/* Modal */}
      <ConfirmModal modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={() => { }}
        message={`Xác nhận xóa bình luận ?`} />

      {/*modal tag */}
      <Modal isOpen={modalFormOpen} toggle={() => setModalFormOpen(false)}>
        <div className=" modal-body p-0">
          <Card className=" bg-secondary shadow border-0">
            <CardHeader className=" bg-white">
              <Row className="align-items-center">
                <Col className="col-8">
                  <h3 className="mb-0">Sở thích</h3>
                </Col>
                <Col className="text-right col-4">
                  <Row className="align-items-center justify-content-end">
                    <Button
                      className="mr-3"
                      outline
                      color="secondary"
                      type="button"
                      onClick={handleEditProfile}
                    >
                      <i
                        className="fas fa-check-circle"
                        style={{ color: "green" }}
                      ></i>
                    </Button>
                    <button
                      aria-label="Close"
                      className=" close"
                      onClick={() => setModalFormOpen(false)}
                      type="button"
                    >
                      <span aria-hidden={true}>×</span>
                    </button>
                  </Row>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className=" px-lg-4 py-lg-4">
              <Row
                className="align-items-center mb-3"
                onClick={() =>
                  setOpenedCollapse(
                    openedCollapse === "collapseArea" ? "" : "collapseArea"
                  )
                }
              >
                <Col className="col-10">
                  <span className="mb-0 text-muted">Khu vực</span>
                </Col>
                <Col className="text-right col-2">
                  <a className=" w-100 text-primary text-left" color="link">
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </Col>
              </Row>
              <Collapse
                isOpen={openedCollapse === "collapseArea"}
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
                id="collapseArea"
              >
                {resource[0].child.map((e) => (
                  <div className=" custom-control custom-control-alternative custom-checkbox mb-3">
                    <input
                      className=" custom-control-input"
                      defaultChecked={!activeArea ? false : activeArea.find(t => t == e.id)}
                      id={'area' + e.id}
                      type="checkbox"
                      value={e.id}
                      onChange={(event) => handlePickArea(event, e.id)}
                    ></input>
                    <label className=" custom-control-label" htmlFor={'area' + e.id}>
                      <span>{e.name}</span>
                    </label>
                  </div>
                ))}
              </Collapse>
              <Row
                className="align-items-center mb-3"
                onClick={() =>
                  setOpenedCollapse(
                    openedCollapse === "collapseDish" ? "" : "collapseDish"
                  )
                }
              >
                <Col className="col-10">
                  <span className="mb-0 text-muted">Món ăn</span>
                </Col>
                <Col className="text-right col-2">
                  <a className=" w-100 text-primary text-left" color="link">
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </Col>
              </Row>
              <Collapse
                isOpen={openedCollapse === "collapseDish"}
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
                id="collapseDish"
              >
                {resource[1].tags.map((e) => (
                  <div className=" custom-control custom-control-alternative custom-checkbox mb-3">
                    <input
                      className=" custom-control-input"
                      id={e.id}
                      type="checkbox"
                      defaultChecked={dinner.favoriteTags.find(t => t.id == e.id)}
                      value={e.id}
                      onChange={(event) => handlePickProfile(event, e.id)}
                    ></input>
                    <label className=" custom-control-label" htmlFor={e.id}>
                      <span>{e.name}</span>
                    </label>
                  </div>
                ))}
              </Collapse>
              <Row
                className="align-items-center mb-3"
                onClick={() =>
                  setOpenedCollapse(
                    openedCollapse === "collapseType" ? "" : "collapseType"
                  )
                }
              >
                <Col className="col-10">
                  <span className="mb-0 text-muted">Loại hình</span>
                </Col>
                <Col className="text-right col-2">
                  <a className=" w-100 text-primary text-left" color="link">
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </Col>
              </Row>
              <Collapse
                isOpen={openedCollapse === "collapseType"}
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
                id="collapseType"
              >
                {resource[2].tags.map((e) => (
                  <div className=" custom-control custom-control-alternative custom-checkbox mb-3">
                    <input
                      className=" custom-control-input"
                      id={e.id}
                      type="checkbox"
                      defaultChecked={dinner.favoriteTags.find(t => t.id == e.id)}
                      value={e.id}
                      onChange={(event) => handlePickProfile(event, e.id)}
                    ></input>
                    <label className=" custom-control-label" htmlFor={e.id}>
                      <span>{e.name}</span>
                    </label>
                  </div>
                ))}
              </Collapse>
              <Row
                className="align-items-center mb-3"
                onClick={() =>
                  setOpenedCollapse(
                    openedCollapse === "collapseNation" ? "" : "collapseNation"
                  )
                }
              >
                <Col className="col-10">
                  <span className="mb-0 text-muted">Quốc gia</span>
                </Col>
                <Col className="text-right col-2">
                  <a className=" w-100 text-primary text-left" color="link">
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </Col>
              </Row>
              <Collapse
                isOpen={openedCollapse === "collapseNation"}
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
                id="collapseNation"
              >
                {resource[4].tags.map((e) => (
                  <div className=" custom-control custom-control-alternative custom-checkbox mb-3">
                    <input
                      className=" custom-control-input"
                      id={e.id}
                      type="checkbox"
                      defaultChecked={dinner.favoriteTags.find(t => t.id == e.id)}
                      value={e.id}
                      onChange={(event) => handlePickProfile(event, e.id)}
                    ></input>
                    <label className=" custom-control-label" htmlFor={e.id}>
                      <span>{e.name}</span>
                    </label>
                  </div>
                ))}
              </Collapse>
              <Row
                className="align-items-center mb-3"
                onClick={() =>
                  setOpenedCollapse(
                    openedCollapse === "collapseOthers" ? "" : "collapseOthers"
                  )
                }
              >
                <Col className="col-10">
                  <span className="mb-0 text-muted">Khác</span>
                </Col>
                <Col className="text-right col-2">
                  <a className=" w-100 text-primary text-left" color="link">
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </Col>
              </Row>
              <Collapse
                isOpen={openedCollapse === "collapseOthers"}
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
                id="collapseOthers"
              >
                {resource[5].tags.map((e) => (
                  <div className=" custom-control custom-control-alternative custom-checkbox mb-3">
                    <input
                      className=" custom-control-input"
                      id={e.id}
                      type="checkbox"
                      defaultChecked={dinner.favoriteTags.find(t => t.id == e.id)}
                      value={e.id}
                      onChange={(event) => handlePickProfile(event, e.id)}
                    ></input>
                    <label className=" custom-control-label" htmlFor={e.id}>
                      <span>{e.name}</span>
                    </label>
                  </div>
                ))}
              </Collapse>
            </CardBody>
          </Card>
        </div>
      </Modal>
    </>
  );
}


CustomerDetail.layout = AdminLayout;
CustomerDetail.title="Khách Hàng";

export default CustomerDetail;
