import React from "react";
import { PaginationItem, PaginationLink, DropdownItem, Container, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, Pagination, Table } from "reactstrap";

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

function SpringTable(props) {
    const {
        HeaderCommponent,
        renderRow,
    } = props;

    return (
        <Table id="review" className="align-items-center" responsive>
            <thead className="thead-light">
                <tr>{HeaderCommponent}</tr>
            </thead>
            <tbody>
                {renderRow()}
            </tbody>
        </Table>
    )
}

export {
    SpringTable,
    SpringPagination
};