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
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardBody,
  Button,
  Form,
  FormGroup,
  InputGroup,
  Input,
  Spinner,
  FormFeedback,
} from "reactstrap";
import AdminLayout from "../../layouts/AdminLayout";
import tagService from "../../services/tagService";
import AlertResult from "../../components/AlertResult";
import ConfirmModel from "../../components/ConfirmModal";
import spring from "../../springRoute";
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

function TagRow({ tag, editAction, deleteAction }) {
  console.log("tag = " + tag.countTag);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [tagName, setTagName] = React.useState(tag.name);
  const [error, setError] = useState(false);

  return (
    <>
      <tr>
        <th>
          {isEdit && (
            <Input
              type="text"
              id="input-tagname"
              defaultValue={tag.tag.name}
              autoFocus={true}
              onChange={(e) => {
                setTagName(e.target.value.trim());
                if (e.target.value.trim() == "") {
                  setError(true);
                } else setError(false);
              }}
              invalid={error}
            ></Input>
          )}
          {!isEdit && <span className="mb-0">{tag.tag.name}</span>}
        </th>
        <td>{tag.countTag}</td>
        <td>
          <Row>
            <Col style={{ padding: 0 }}>
              {!isEdit && (
                <Button
                  className="btn-sm"
                  outline
                  color="secondary"
                  type="button"
                  onClick={() => {
                    setTagName(tag.tag.name);
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
                <Button
                  disabled={error}
                  className="btn-sm"
                  outline
                  color="secondary"
                  type="button"
                  onClick={() => {
                    console.log("EIDT");
                    editAction(tag.tag.id, tagName);
                    setIsEdit(false);
                  }}
                >
                  <i
                    className="fas fa-check-circle"
                    style={{ color: "green" }}
                  ></i>
                </Button>
              )}
            </Col>
            <Col style={{ padding: 0 }}>
              {isEdit && (
                <Button
                  className="btn-sm"
                  outline
                  color="secondary"
                  type="button"
                  onClick={() => setIsEdit(false)}
                >
                  <i
                    className="fas fa-times-circle"
                    style={{ color: "red" }}
                  ></i>
                </Button>
              )}
              {!isEdit && (
                <Button
                  className="btn-sm"
                  outline
                  color="secondary"
                  type="button"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <i className="fas fa-trash" style={{ color: "red" }}></i>
                </Button>
              )}
            </Col>
          </Row>
        </td>
      </tr>
      {modalOpen && (
        <ConfirmModel
          modal={modalOpen}
          setModal={setModalOpen}
          title={"Thông báo"}
          handleAction={() => deleteAction(tag.tag.id)}
          message={`Xác nhận xóa thẻ ${tag.tag.name} ?`}
        />
      )}
    </>
  );
}

function TagTable({ isSearch, model, setUrl }) {
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
      name: "Tên thẻ",
      field: "name",
      isSortable: true,
      sortOrder: 0,
    },
    {
      name: "Số lượng nhà hàng",
      field: "countUsing",
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

  // Data fetching
  let url =
    `${spring.admin.tag}?page=` +
    page +
    "&size=" +
    size +
    "&sortable=" +
    sort.field +
    "&direction=" +
    sort.direction;
  if (isSearch) {
    url = `${spring.resource}/search?query=${model}&page=${page}&size=${size}&sortable=${sort.field}&direction=${sort.direction}`;
  }
  
  useEffect(() => {
    setUrl(url);
  }, [url]);

  const { data: tags, error } = useSWR(url);

  const handleEdit = (id, data) => {
    console.log("PUT");
    console.log(data);
    tagService.update(id, data).then((res) => {
      // update successfully!
      mutate(url);
    });
  };

  const handleDelete = (id) => {
    tagService.delete(id).then((res) => {
      // update successfully!
      if (res.status == "update") {
        Alert.showDeleteSuccess();
      } else Alert.showError();
      mutate(url);
    });
  };

  if (!tags) return <Spinner type="grow" color="primary" />;

  return (
    <>
      <CardBody>
        <Table
          id="tag"
          className="align-items-center table-flush table"
          responsive
        >
          <thead className="thead-light">
            <tr>{HeaderComponent}</tr>
          </thead>
          <tbody>
            {tags.content.map((tag) => (
              <TagRow
                tag={tag}
                editAction={handleEdit}
                deleteAction={handleDelete}
              />
            ))}
          </tbody>
        </Table>
      </CardBody>
      <CardFooter className="py-4">
        <nav aria-label="...">
          <SpringPagination
            model={tags}
            setPage={setPage}
            size={size}
            setSize={setSize}
          />
        </nav>
      </CardFooter>
    </>
  );
}

function Tag() {
  //state
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({
    type: "",
    message: "",
  });
  const [model, setModel] = useState();
  const [isSearch, setIsSearch] = useState(false);
  const [url, setUrl] = useState();

  const search = (e) => {
    e.preventDefault();
    setIsSearch(true);
  };

  const handleCreate = () => {
    if (name == null || name == undefined || name.trim() == "") {
      setErrors({
        type: "create",
        message: "Không được trống.",
      });
      return;
    }

    tagService.create(name).then((res) => {
      // update successfully!
      if (res.status == "CREATED") {
        Alert.showCreateSuccess();
      } else Alert.showError();
      setName("");
      mutate(url);
    });
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
          <div className="mb-5 mb-xl-0 col-xl-8">
            <Card className="shadow">
              <CardHeader>
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
                </Row>
              </CardHeader>
              <TagTable isSearch={isSearch} model={model} setUrl={setUrl} />
            </Card>
          </div>
          <div className="col-xl-4">
            <Card className="shadow bg-secondary">
              <CardHeader className="border-0 bg-white">
                <Row className="align-items-center">
                  <div className="col-8">
                    <h3 className="mb-0 text-uppercase">Thêm thẻ</h3>
                  </div>
                  <div className="text-right col-4">
                    <Button
                      color="primary"
                      className="btn btn-primary btn-sm"
                      onClick={handleCreate}
                    >
                      Thêm
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-tagname"
                    >
                      Tên thẻ
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      placeholder="Nhập tên thẻ"
                      type="text"
                      id="input-tagname"
                      className="form-control"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      invalid={errors.type == "create" ? true : false}
                    ></Input>
                    {errors.type == "create" && (
                      <FormFeedback>{errors.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

Tag.layout = AdminLayout;
Tag.title = "Thẻ";

export default Tag;
