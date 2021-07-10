import React from "react";
import { Container, Row } from "reactstrap";

function Loading() {
    return (
        <>
                <div className="header bg-gradient-dark pb-8 pt-5 pt-md-8">
                    <Container fluid>
                        <div className="header-body">
                            {/* Card stats */}
                            <Row>
                            </Row>
                        </div>
                    </Container>
                </div>
                {/* Body */}
                <Container className="mt--7" fluid>
                    <Row>
                        <div className="col">
                            <p>Loading...</p>
                        </div>
                    </Row>
                </Container>
            </>
    );
}

export default Loading;