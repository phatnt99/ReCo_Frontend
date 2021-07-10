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
  Modal,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  InputGroup,
} from "reactstrap";
import AdminLayout from "../../../layouts/OwnerLayout";
import Link from "next/link";
import spring from "../../../springRoute";
import ConfirmModel from "../../../components/ConfirmModal";
import reportService from "../../../services/reportService";
import Alert from "../../../components/Alert2";
import { useForm } from "react-hook-form";

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

function ReportRow({ report, url }) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const buildReport = (type) => {
    if (type == 1) return "Nhà hàng";
    if (type == 2) return "Review";
    if (type == 3) return "Khuyến mãi";
  };

  const agent = (type, name, id) => {
    if (type == 1)
      return (
        <Button>
          <Link href={"/restaurants/" + id}>{report.reportableName}</Link>
        </Button>
      );
    if (type == 2)
      return (
        <Button>
          <Link href={"/reviews/" + id}>{report.reportableName}</Link>
        </Button>
      );
    if (type == 3)
      return (
        <Button>
          <Link href={"/vouchers/" + id}>{report.reportableName}</Link>
        </Button>
      );
    if (type == 5)
      return (
        <Button>
          <Link href={"/owners/" + id}>{report.reportableName}</Link>
        </Button>
      );
  };

  return (
    <>
      <tr>
        <td
          style={{
            maxWidth: "13em",
          }}
        >
          <span className="mb-0">
            {new Date(report.createdAt).toLocaleString()}
          </span>
        </td>
        <th
          style={{
            maxWidth: "20em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{report.restaurantName}</span>
        </th>
        <td
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span className="mb-0">{buildReport(report.type)}</span>
        </td>
        <td style={{ paddingRight: "0" }}>
          <Button
            outline
            color="secondary"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <i className="fas fa-eye"></i>
          </Button>
        </td>
      </tr>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <Card
          className="card-pricing bg-gradient-danger border-0"
          style={{ width: "45vw" }}
        >
          <CardHeader className="bg-transparent text-center">
            <div className="float-center btn btn-default btn-sm">Báo lỗi</div>
            <h4 className="text-uppercase ls-1 text-white py-2 mb-0">
              {report.restaurantName}
            </h4>
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
                  <Col>
                    <p className="text-white">Loại báo lỗi:</p>
                  </Col>
                  <Col>
                    <p className="pl-2" style={{ color: "black" }}>
                      {buildReport(report.type)}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col className="col-6 text-right">
                <Row>
                  <Col>
                    <p className="text-white">Thời gian:</p>
                  </Col>
                  <Col>
                    <p className="pl-2" style={{ color: "black" }}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col className="col-12">
                <Row>
                  <Col>
                    <p className="text-white">Đối tượng bị báo lỗi:</p>
                  </Col>
                  <Col>
                    {agent(
                      report.type,
                      report.reportableName,
                      report.reportableId
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="col-12">
                <Row>
                  <Col className="col-12">
                    <p className="text-white">Nội dung:</p>
                  </Col>
                  <Col className="col-12" style={{ color: "black" }}>
                    <p className="pl-2">{report.content}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Modal>
    </>
  );
}

function Report() {
  //
  const [model, setModel] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  //Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [sort, setSort] = useState({
    field: "updatedAt",
    direction: "DESC",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const authId = localStorage.getItem("authId");

  // Data fetching
  const url = `${spring.report}/owner/${authId}?page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  const { data: reports, error } = useSWR(url);

  //Headers
  const headers = [
    {
      name: "Ngày đăng",
      field: "createdAt",
      isSortable: true,
    },
    {
      name: "Nhà hàng",
      field: "restaurant.name",
      isSortable: true,
      sortOrder: 0,
    },
    {
      name: "Loại",
      field: "type",
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

  const sendReport = (data) => {
    const request = {
      ...data,
      reportableId: authId,
      type: 5,
    };

    reportService.send(request).then((res) => {
      if (res.status == "CREATED") {
        Alert.showCreateSuccess();
      } else Alert.showError();
    });
  };

  if (!reports)
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
                  <Col></Col>
                  <Col className="text-right"></Col>
                </Row>
              </CardHeader>
              <Table id="review" className="align-items-center" responsive>
                <thead className="thead-light">
                  <tr>{HeaderComponent}</tr>
                </thead>
                <tbody>
                  <div>
                    <Spinner type="grow" color="primary" />
                  </div>
                </tbody>
              </Table>
            </Card>
          </Row>
        </Container>
      </>
    );

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
                          onChange={(e) => {}}
                        ></input>
                        <button
                          onClick={(e) => {}}
                          style={{ display: "none" }}
                        ></button>
                      </InputGroup>
                    </FormGroup>
                  </Form>
                </Col>
                <Col className="text-right">
                  <Button color="danger" onClick={() => setModalOpen(true)}>
                    Báo lỗi
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <Table id="review" className="align-items-center" responsive>
              <thead className="thead-light">
                <tr>{HeaderComponent}</tr>
              </thead>
              <tbody>
                {reports.content.map((report) => (
                  <ReportRow
                    report={report}
                    model={model}
                    setModel={setModel}
                    url={url}
                  />
                ))}
              </tbody>
            </Table>
            <CardFooter>
              <SpringPagination
                model={reports}
                setPage={setPage}
                size={size}
                setSize={setSize}
              />
            </CardFooter>
          </Card>
        </Row>
      </Container>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <Form onSubmit={handleSubmit(sendReport)}>
          <Card className="card-pricing border-0" style={{ width: "45vw" }}>
            <CardHeader className="bg-transparent text-center">
              <h4 className="text-uppercase ls-1 py-2 mb-0">báo lỗi</h4>
            </CardHeader>
            <CardBody
              style={{
                paddingLeft: "3rem !important",
                paddingRight: "3rem !important",
                paddingTop: "0!important",
                paddingBottom: "0!important",
              }}
            >
              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label>
                      Nội dung báo lỗi<span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      className="mt-1"
                      type="textarea"
                      placeholder="Mô tả lỗi/thông tin sai mà bạn gặp phải"
                      {...register("content", {
                        required: true,
                      })}
                      invalid={errors.content ? true : false}
                    />
                    {errors.content && (
                      <FormFeedback>Không được trống.</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="justify-content-end d-flex">
              <Button color="primary" type="submit">
                Gửi
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </Modal>
    </>
  );
}

Report.layout = AdminLayout;
Report.title = "Báo Cáo";

export default Report;
