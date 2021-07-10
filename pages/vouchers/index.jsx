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
  Spinner,
  CardFooter,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap";
import AdminLayout from "../../layouts/AdminLayout";
import Link from "next/link";
import spring from "../../springRoute";
import ConfirmModel from "../../components/ConfirmModal";
import voucherService from "../../services/voucherService";
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

function VoucherRow({ voucher, url }) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const el = [];
  for (let i = 0; i < voucher.overallStar; i++) {
    el.push(<i className="fas fa-star" style={{ color: "orange" }}></i>);
  }

  const deleteAction = () => {
    // delete one or bulk
    voucherService.bulkDelete([voucher.id]).then((res) => {
      if ((res.status = "update")) {
        Alert.showDeleteSuccess();
        mutate(url);
      }
    });
  };

  return (
    <>
      <tr>
        <td
          style={{
            maxWidth: "13em",
          }}
        >
          <span className="mb-0">{voucher.code}</span>
        </td>
        <th
          style={{
            maxWidth: "15em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{voucher.title}</span>
        </th>
        <td
          style={{
            maxWidth: "20em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">
            {"Từ " + voucher.fromTime + " đến " + voucher.toTime}
          </span>
        </td>
        <td
          style={{
            maxWidth: "23em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{voucher.restaurant?.name}</span>
        </td>
        <td className="text-right">
          <Link href={"/vouchers/" + voucher.id}>
            <Button
              outline
              color="secondary"
              type="button"
              onClick={() => setOpen(true)}
            >
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
      <ConfirmModel
        modal={modalOpen}
        setModal={setModalOpen}
        title={"Thông báo"}
        handleAction={deleteAction}
        message={`Xác nhận xóa voucher ?`}
      />
    </>
  );
}

function VoucherTable({ isSearch, search }) {
  //
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "updatedAt",
    direction: "DESC",
  });

  // Data fetching
  let url = `${spring.voucher}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  if (isSearch)
    url = `${spring.voucher}/search?query=${search}&page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;

  const { data: vouchers, error } = useSWR(url);

  //Headers
  const headers = [
    {
      name: "Code",
      field: "code",
      isSortable: false,
    },
    {
      name: "Tiêu đề",
      field: "title",
      isSortable: true,
      sortOrder: 0,
    },
    {
      name: "Thời hạn",
      field: "toTime",
      isSortable: true,
    },
    {
      name: "Nhà hàng",
      field: "restaurant.name",
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
      let map = vouchers.content.map((c) => c.id);
      setModel(map);
    } else {
      // check if model.length is fullill mean uncheckall
      // otherwise mean one of them uncheck itself and cause chekAll uncheck
      if (model.length == vouchers?.content?.length) {
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
    if (model.length == vouchers?.content?.length) setCheckAll(true);
    else setCheckAll(false);
  }, [model]);

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

  if (!vouchers)
    return (
      <>
        <Spinner type="grow" color="primary" />
      </>
    );

  return (
    <>
      <CardBody>
        <Table id="review" className="align-items-center" responsive>
          <thead className="thead-light">
            <tr>{HeaderComponent}</tr>
          </thead>
          <tbody>
            {vouchers.content.map((voucher) => (
              <VoucherRow
                voucher={voucher}
                model={model}
                setModel={setModel}
                url={url}
              />
            ))}
          </tbody>
        </Table>
      </CardBody>
      <CardFooter>
        <SpringPagination
          model={vouchers}
          setPage={setPage}
          size={size}
          setSize={setSize}
        />
      </CardFooter>
    </>
  );
}

function Voucher() {
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
                <Col className="text-right">
                  <Link href="/vouchers/create">
                    <Button color="success">Thêm khuyến mãi</Button>
                  </Link>
                </Col>
              </Row>
            </CardHeader>
            <VoucherTable isSearch={isSearch} search={model} />
          </Card>
        </Row>
      </Container>
    </>
  );
}

Voucher.layout = AdminLayout;
Voucher.title = "Khuyến Mãi";

export default Voucher;
