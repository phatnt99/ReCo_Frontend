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
  ModalFooter,
  InputGroup,
  Spinner,
  CardFooter,
} from "reactstrap";
import AdminLayout from "../../layouts/AdminLayout";
import Link from "next/link";
import spring from "../../springRoute";
import ConfirmModal from "../../components/ConfirmModal";
import userService from "../../services/userService";
import Alert from "../../components/Alert2";

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

function DinnerRow({ customer, model, setModel, url }) {
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleDelete = () => {
    userService.bulkDelete([customer.id]).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
      } else Alert.showError();
      mutate(url);
    });
  };

  return (
    <>
      <tr>
        <td style={{ paddingLeft: "", paddingRight: "0" }}>
          <div className="form-check">
            <input
              className="form-check-input position-static"
              type="checkbox"
              id="blankCheckbox"
              checked={model.includes(customer.id)}
              value={customer.id}
              onClick={(e) => {
                //handle check one
                if (!model.includes(customer.id)) {
                  setModel([...model, customer.id]);
                } else {
                  setModel(model.filter((m) => m != customer.id));
                }
              }}
            ></input>
          </div>
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
              <img src={customer.avatar}></img>
            </a>
            <div className="media">
              <span className="mb-0 text-sm">{customer.fullName}</span>
            </div>
          </div>
        </th>
        <td>
          <span className="mb-0">{customer.reservationCount}</span>
        </td>
        <td
          style={{
            maxWidth: "13em",
          }}
        >
          <span className="mb-0">{customer.reviewCount}</span>
        </td>
        <td
          style={{
            maxWidth: "13em",
          }}
        >
          <span className="mb-0">
            {new Date(customer.createdAt).toLocaleString()}
          </span>
        </td>
        <td
          style={{
            paddingLeft: "0",
          }}
        >
          <Link href={"/diners/" + customer.id}>
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
        message={`Xác nhận xóa người dùng này ?`}
      />
    </>
  );
}

function DinerTable({ isSearch, search, model, setModel }) {
  //
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "updatedAt",
    direction: "ASC",
  });

  //Headers
  const headers = [
    {
      name: "",
      field: "checkbox",
      isSortable: false,
    },
    {
      name: "Người dùng",
      field: "fullName",
      isSortable: true,
    },
    {
      name: "Lượt đặt chỗ",
      field: "reservationCount",
      isSortable: false,
    },
    {
      name: "Lượt review",
      field: "reviewCount",
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
      let map = diners.content.map((c) => c.id);
      setModel(map);
    } else {
      console.log("chekc false");
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == diners?.content?.length) {
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
    if (model.length == diners?.content?.length) setCheckAll(true);
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
  let url = `${spring.diner}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (isSearch)
    url = `${spring.diner}/search?query=${search}&page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  const { data: diners, error } = useSWR(url);

  if (!diners)
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
          {diners.content.map((diner) => (
            <DinnerRow
              customer={diner}
              model={model}
              setModel={setModel}
              url={url}
            />
          ))}
        </tbody>
      </Table>
      <CardFooter>
        <SpringPagination
          model={diners}
          setPage={setPage}
          size={size}
          setSize={setSize}
        />
      </CardFooter>
    </>
  );
}

function Dinner() {
  const [model, setModel] = useState([]);
  const [query, setQuery] = useState();
  const [isSearch, setIsSearch] = useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const search = (e) => {
    e.preventDefault();
    setIsSearch(true);
  };

  const handleDelete = () => {
    userService.bulkDelete(model).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
      } else Alert.showError();
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
          <Col>
            <Card className="shadow">
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
                    )}
                  </Col>
                </Row>
              </CardHeader>
              <DinerTable
                isSearch={isSearch}
                search={query}
                model={model}
                setModel={setModel}
              />
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Modal */}
      <ConfirmModal
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={handleDelete}
        message={`Xác nhận xóa người dùng này ?`}
      />
    </>
  );
}

Dinner.layout = AdminLayout;
Dinner.title = "Khách Hàng";

export default Dinner;
