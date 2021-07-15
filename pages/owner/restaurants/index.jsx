import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import {
  Card,
  Container,
  Row,
  Col,
  CardHeader,
  Table,
  Media,
  Badge,
  Form,
  FormGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  InputGroup,
  Button,
  Spinner,
} from "reactstrap";
import AdminLayout from "../../../layouts/OwnerLayout";
import Link from "next/link";
import spring from "../../../springRoute";
import ConfirmModel from "../../../components/ConfirmModal";
import Alert from "../../../components/Alert2";
import restaurantService from "../../../services/restaurantService";

function SpringPagination({ restaurant, setPage, size, setSize }) {
  let oneBaseIndex = restaurant.number + 1;
  let startPage = oneBaseIndex - 2 <= 0 ? 1 : oneBaseIndex - 2;
  let endPage =
    oneBaseIndex + 2 > restaurant.totalPages
      ? restaurant.totalPages
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
            {!restaurant.first && (
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
            {!restaurant.last && (
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

function RestaurantRow({ restaurant, url }) {
  console.log(restaurant);

  const [modalOpen, setModalOpen] = React.useState(false);

  const renderApproveStatus = () => {
    const approveStatus = [];
    if (restaurant.approveStatus == 1)
      approveStatus.push(
        <Badge color="" className="badge-dot mr-4">
          <i className="bg-warning" />
          Chờ duyệt
        </Badge>
      );
    else if (restaurant.approveStatus == 2)
      approveStatus.push(
        <Badge color="" className="badge-dot mr-4">
          <i className="bg-success" />
          Đã duyệt
        </Badge>
      );
    else if (restaurant.approveStatus == 3)
      approveStatus.push(
        <Badge color="" className="badge-dot mr-4">
          <i className="bg-danger" />
          Đã khóa
        </Badge>
      );

    return approveStatus;
  };

  const approveStatus = renderApproveStatus();

  const deleteAction = () => {
    restaurantService.delete(restaurant.id).then((res) => {
      if (res.status == "update") {
        Alert.showDeleteSuccess();
        mutate(url);
      }
    });
  };

  return (
    <tr>
      <th scope="row">
        <Media className="align-items-center">
          <a
            className="avatar rounded-circle mr-3"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <img alt="..." src={restaurant.logo} />
          </a>
          <Media>
            <span className="mb-0">{restaurant.name}</span>
          </Media>
        </Media>
      </th>
      <td>
        <span className="mb-0">{restaurant.address.detail}</span>
      </td>
      <td>{approveStatus}</td>
      <td className="text-right">
        <Link href={"/owner/restaurants/" + restaurant.id}>
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
      <ConfirmModel
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={deleteAction}
        message={`Xác nhận xóa nhà hàng ?`}
      />
    </tr>
  );
}

function RestaurantTable({ isSearch, model }) {
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "updatedAt",
    direction: "DESC",
  });

  //Headers
  const headers = [
    {
      name: "Tên nhà hàng",
      field: "name",
      isSortable: true,
      sortOrder: 0,
    },
    {
      name: "Địa chỉ",
      isSortable: false,
    },
    {
      name: "Trạng thái duyệt",
      field: "approveStatus",
      isSortable: true,
      sortOrder: 1,
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
  const authId = localStorage.getItem("authId");
  let url =
    `${spring.owner_restaurant}/${authId}?page=` +
    page +
    "&size=" +
    size +
    "&sortable=" +
    sort.field +
    "&direction=" +
    sort.direction;
  if (isSearch) {
    url = `${spring.search_restaurant2}/${authId}?query=${model}&page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  }
  const { data: restaurants, error } = useSWR(url);

  if (!restaurants)
    return (
      <>
        <Table
          id="restaurant"
          className="align-items-center table-flush"
          responsive
        >
          <thead className="thead-light">
            <tr>{HeaderComponent}</tr>
          </thead>
          <tbody>
            <div>
              <Spinner type="grow" color="primary" />
            </div>
          </tbody>
        </Table>
      </>
    );

  return (
    <>
      <Table
        id="restaurant"
        className="align-items-center table-flush"
        responsive
      >
        <thead className="thead-light">
          <tr>{HeaderComponent}</tr>
        </thead>
        <tbody>
          {restaurants.content.map((restaurant) => (
            <RestaurantRow restaurant={restaurant} url={url} />
          ))}
        </tbody>
      </Table>
      <CardFooter className="py-4">
        <nav aria-label="...">
          <SpringPagination
            restaurant={restaurants}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />
        </nav>
      </CardFooter>
    </>
  );
}

function Restaurants() {
  const [model, setModel] = useState();
  const [isSearch, setIsSearch] = useState(false);

  const search = (e) => {
    e.preventDefault();
    setIsSearch(true);
  };

  useEffect(() => {
    if (model == "") {
      setIsSearch(false);
    }
  }, [model]);

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
              <Row>
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
                          onChange={(e) => setModel(e.target.value)}
                        ></input>
                        <button
                          onClick={(e) => search(e)}
                          style={{ display: "none" }}
                        ></button>
                      </InputGroup>
                    </FormGroup>
                  </Form>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Link href="restaurants/create">
                    <Button color="success">Thêm nhà hàng</Button>
                  </Link>
                </Col>
              </Row>
            </CardHeader>
            <RestaurantTable isSearch={isSearch} model={model} />
          </Card>
        </Row>
      </Container>
    </>
  );
}

Restaurants.layout = AdminLayout;
Restaurants.title="Nhà Hàng";

export default Restaurants;
