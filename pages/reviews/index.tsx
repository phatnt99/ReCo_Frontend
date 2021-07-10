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
  Button,
  Form,
  FormGroup,
  Spinner,
  InputGroup,
  CardFooter,
} from "reactstrap";
import AdminLayout from "../../layouts/AdminLayout";
import Link from "next/link";
import spring from "../../springRoute";
import ConfirmModel from "../../components/ConfirmModal";
import reviewService from "../../services/reviewService";
import Alert from "../../components/Alert2";

function SpringPagination({ model, setPage, size, setSize }) {
  let oneBaseIndex = model.number + 1;
  let startPage = oneBaseIndex - 2 <= 0 ? 1 : oneBaseIndex - 2;
  let endPage =
    oneBaseIndex + 2 > model.totalPages
      ? model.totalPages
      : oneBaseIndex + 2;
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

function ReviewRow({ review, url }) {
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
        <th style={{
          maxWidth: "19rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          <span className="mb-0">{review.title}</span>
        </th>
        <td>
          <span className="mb-0">{review.user.fullName}</span>
        </td>
        <td style={{
          maxWidth: "15rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
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
                <Button outline color="secondary" type="button" style={{ marginRight: "2rem" }}>
                  <i className="fas fa-eye"></i>
                </Button>
              </Link>
            </Col>
            <Col className="col-6">
              <Button
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
      {modalOpen && <ConfirmModel
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={() => {
          reviewService.delete(review.id).then((res) => {
            // update successfully!
            if (res.status == "update") {
              Alert.showDeleteSuccess();
              mutate(url);
            } else Alert.showError();
          });
        }}
        message={`Xác nhận xóa bài review ?`} />}
    </>
  );
}

function ReviewTable({ isSearch, model }) {

  console.log("LOAD TABLE")
  console.log(isSearch)
  console.log(model)
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "",
    direction: "DESC",
  });

  //Headers
  const headers = [
    {
      name: "Ngày đăng",
      field: "createdAt",
      isSortable: true,
    },
    {
      name: "Tiêu đề",
      field: "title",
      isSortable: true,
      sortOrder: 0,
    },
    {
      name: "Người đăng",
      field: "user",
      isSortable: true,
    },
    {
      name: "Nhà hàng",
      field: "restaurant.name",
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

  let url = `${spring.review}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (isSearch) {
    url = `${spring.search_review}${model}&page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  }

  const { data: reviews, error } = useSWR(url);

  return (
    <>
      <Table
        id="review"
        className="align-items-center table-flush"
        responsive
      >
        <thead className="thead-light">
          <tr>{HeaderComponent}</tr>
        </thead>
        <tbody>
          {!reviews && <Spinner type="grow" color="primary" />}
          {reviews && reviews.content.map((review) => (
            <ReviewRow review={review} url={url} />
          ))}
        </tbody>
      </Table>
      <CardFooter className="py-4">
        <nav aria-label="...">
          {reviews && <SpringPagination
            model={reviews}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />}
        </nav>
      </CardFooter>
    </>
  );
}

function Review() {
  //Pagination
  const [model, setModel] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState({
    field: "",
    direction: "DESC",
  });

  const search = (e) => {
    e.preventDefault();
    setIsSearch(true);
  }

  useEffect(() => {
    if (model == '') {
      setIsSearch(false)
    }
  }, [model])

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
          <Card className="shadow" style={{width: '100%'}}>
            <CardHeader className="border-0">
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
                      onChange={(e) => setModel(e.target.value)}
                    ></input>
                    <button onClick={(e) => search(e)} style={{display: 'none'}}></button>
                  </InputGroup>
                </FormGroup>
              </Form>
            </CardHeader>
            <ReviewTable isSearch={isSearch} model={model} />
          </Card>
        </Row>
      </Container>
    </>
  );
}

Review.layout = AdminLayout;
Review.title="Review";

export default Review;
