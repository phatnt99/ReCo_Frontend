import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

function ConfirmModal(props) {
    const {
        title,
        handleAction,
        message,
        modal,
        setModal
    } = props;

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{title}</ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => {
                        handleAction();
                        toggle();
                    }}>Xác nhận</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Hủy</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default ConfirmModal;