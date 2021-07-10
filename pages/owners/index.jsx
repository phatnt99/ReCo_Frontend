import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import {
  Card,
  Container,
  Row,
  Col,
  CardHeader,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardBody,
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  Spinner,
  InputGroup,
  Badge,
  CardFooter
} from "reactstrap";
import AdminLayout from "../../layouts/AdminLayout";
import Link from "next/link";
import spring from "../../springRoute";
import ownerService from "../../services/ownerService";
import ConfirmModal from "../../components/ConfirmModal";
import Alert from "../../components/Alert2";

const type = {
  WAITING: 1,
  ACTIVE: 2,
  BLOCKED: 3,
};

function SpringPagination({ model, setPage, size, setSize }) {
  let oneBaseIndex = model.number + 1;
  let startPage = oneBaseIndex - 2 <= 0 ? 1 : oneBaseIndex - 2;
  let endPage =
    oneBaseIndex + 2 > model.totalPages ? model.totalPages : oneBaseIndex + 2;
  let pageRange = [5, 15, 20, 50];
  let pageItem = [];
  let rangeComponent = [];

  for (let i = startPage; i <= endPage; i++) {
    pageItem.push(
      <PaginationItem className={i == oneBaseIndex ? "active" : ""}>
        <PaginationLink
          onClick={(e) => {
            e.preventDefault();
            setPage(i - 1);
          }}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  pageRange.forEach((page) => {
    rangeComponent.push(
      <DropdownItem
        href="#pablo"
        onClick={(e) => {
          e.preventDefault();
          setSize(page);
        }}
      >
        {page}
      </DropdownItem>
    );
  });

  return (
    <Container>
      <Row>
        <Col>
          <UncontrolledDropdown>
            <DropdownToggle caret onClick={(e) => e.preventDefault()}>
              {size}
            </DropdownToggle>
            <DropdownMenu>{rangeComponent}</DropdownMenu>
          </UncontrolledDropdown>
        </Col>
        <Col>
          <Pagination
            className="pagination justify-content-end mb-0"
            listClassName="justify-content-end mb-0"
          >
            {!model.first && (
              <PaginationItem>
                <PaginationLink
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(oneBaseIndex - 1 - 1);
                  }}
                  tabIndex={-1}
                >
                  <i className="fas fa-angle-left" />
                  <span className="sr-only">Previous</span>
                </PaginationLink>
              </PaginationItem>
            )}
            {pageItem}
            {!model.last && (
              <PaginationItem>
                <PaginationLink
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(oneBaseIndex - 1 + 1);
                  }}
                >
                  <i className="fas fa-angle-right" />
                  <span className="sr-only">Next</span>
                </PaginationLink>
              </PaginationItem>
            )}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}
function OwnerRow({ owner, model, setModel }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const renderApproveStatus = () => {
    const approveStatus = [];
    if (owner.status == 1)
      approveStatus.push(
        <Badge color="" className="badge-dot mr-4">
          <i className="bg-warning" />
          Chờ duyệt
        </Badge>
      );
    else if (owner.status == 2)
      approveStatus.push(
        <Badge color="" className="badge-dot mr-4">
          <i className="bg-success" />
          Đã duyệt
        </Badge>
      );
    else if (owner.status == 3)
      approveStatus.push(
        <Badge color="" className="badge-dot mr-4">
          <i className="bg-danger" />
          Đã khóa
        </Badge>
      );

    return approveStatus;
  };

  const handleDelete = () => {
    ownerService.bulkDelete([owner.id]).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
      } else Alert.showError();
      mutate(spring.owner);
    });
  };

  const approveStatus = renderApproveStatus();

  return (
    <>
      <tr>
        <td style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              checked={model.includes(owner.id)}
              value={owner.id}
              onClick={(e) => {
                //handle check one
                if (!model.includes(owner.id)) {
                  setModel([...model, owner.id]);
                } else {
                  setModel(model.filter((m) => m != owner.id));
                }
              }}
            ></input>
          </div>
        </td>
        <td
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {approveStatus}
        </td>
        <th
          scope="row"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <div className="align-items-center media">
            <a className="avatar rounded-circle mr-3" href="">
              <img src={owner.avatar}></img>
            </a>
            <div className="media">
              <span className="mb-0 text-sm">{owner.fullName}</span>
            </div>
          </div>
        </th>
        <td>
          <span className="mb-0">{owner.restaurantCount}</span>
        </td>
        <td>
          <span className="mb-0">{owner.reservationCount}</span>
        </td>
        <td style={{}}>
          <span className="mb-0">
            {new Date(owner.createdAt).toLocaleString()}
          </span>
        </td>
        <td
          style={{
            paddingLeft: "0",
          }}
        >
          <Link href={"/owners/" + owner.id}>
            <Button outline color="secondary" type="button">
              <i className="fas fa-eye"></i>
            </Button>
          </Link>
          <Button
            outline
            color="secondary"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <i className="fas fa-times-circle" style={{ color: "red" }}></i>
          </Button>
        </td>
      </tr>
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={handleDelete}
        message={`Xác nhận xóa chủ nhà hàng ?`}
      />
    </>
  );
}

function OwnerTable({ isSearch, search, model, setModel }) {
  //
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
      name: "Trạng thái",
      field: "status",
      isSortable: true,
    },
    {
      name: "Người dùng",
      field: "fullName",
      isSortable: true,
    },
    {
      name: "Số lượng nhà hàng",
      field: "restaurantCount",
      isSortable: false,
    },
    {
      name: "Số lượng đặt bàn",
      field: "reservationCount",
      isSortable: false,
    },
    {
      name: "Ngày đăng ký",
      field: "createdAt",
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

  useEffect(() => {
    if (checkAll) {
      let map = owners.content.map((c) => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == owners?.content?.length) {
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
    if (model.length == owners?.content?.length) setCheckAll(true);
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
  let url = `${spring.owner}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (isSearch)
    url = `${spring.owner}/search?query=${query}&page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;

  const { data: owners, error } = useSWR(spring.owner);

  if (!owners)
    return (
      <>
        <Spinner type="grow" color="primary" />
      </>
    );

  return (
    <>
      <Table id="review" className="align-items-center" responsive>
        <thead className="thead-light">
          <tr>{HeaderComponent}</tr>
        </thead>
        <tbody>
          {owners.content.map((owner) => (
            <OwnerRow owner={owner} model={model} setModel={setModel} />
          ))}
        </tbody>
      </Table>
      <CardFooter>
        <SpringPagination
          model={owners}
          setPage={setPage}
          size={size}
          setSize={setSize}
        />
      </CardFooter>
    </>
  );
}

function Owner() {
  //
  const [model, setModel] = useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [query, setQuery] = useState();
  const [isSearch, setIsSearch] = useState(false);

  const search = (e) => {
    e.preventDefault();
    setIsSearch(true);
  };

  const handleDelete = () => {
    ownerService.bulkDelete(model).then((res) => {
      mutate(spring.owner);
    });
  };

  const handleApprove = (type) => {
    ownerService.bulkApprove(model, type).then((res) => {
      mutate(spring.owner);
    });
  };

  useEffect(() => {
    if (query == "") {
      setIsSearch(false);
    }
  }, [query]);

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
          <Card className="shadow" style={{ width: "100%" }}>
            <CardHeader className="border-0">
              <Row className="align-items-center">
                <Col>
                  <Form className="navbar-search-light form-inline mr-3 d-none d-md-flex ml-lg-auto">
                    <FormGroup className="mb-0">
                      <InputGroup className="input-group-alternative">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i
                              className="fas fa-search"
                              style={{ color: "#525f7f" }}
                            ></i>
                          </span>
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tìm kiếm"
                          onChange={(e) => setQuery(e.target.value)}
                        ></input>
                        <button
                          onClick={(e) => search(e)}
                          style={{ display: "none" }}
                        ></button>
                      </InputGroup>
                    </FormGroup>
                  </Form>
                </Col>
                <Col className="text-right">
                  {model.length > 0 && (
                    <>
                      <Button
                        className="btn"
                        color="success"
                        type="button"
                        onClick={() => handleApprove(type.ACTIVE)}
                      >
                        <i
                          className="fas fa-thumbs-up"
                          style={{ color: "white", paddingRight: "0.5rem" }}
                        ></i>
                        Duyệt
                      </Button>
                      <Button
                        className="btn"
                        color="default"
                        type="button"
                        onClick={() => handleApprove(type.BLOCKED)}
                      >
                        <i
                          className="fas fa-thumbs-down"
                          style={{ color: "white", paddingRight: "0.5rem" }}
                        ></i>
                        Từ chối
                      </Button>
                      <Button
                        className="btn btn-warning"
                        type="button"
                        onClick={() => setModalOpen(!modalOpen)}
                      >
                        <i
                          className="fas fa-times-circle"
                          style={{ color: "white", paddingRight: "0.5rem" }}
                        ></i>
                        Xóa
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
            </CardHeader>
            <OwnerTable
              isSearch={isSearch}
              search={query}
              model={model}
              setModel={setModel}
            />
          </Card>
        </Row>
      </Container>
      {/* Modal */}
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={handleDelete}
        message={`Xác nhận xóa chủ nhà hàng ?`}
      />
    </>
  );
}

Owner.layout = AdminLayout;
Owner.title = "Đối Tác";

export default Owner;
