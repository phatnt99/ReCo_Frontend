import React from "react";
import { useDropzone } from "react-dropzone";
import { Row } from "reactstrap";

export default function UploadLogo({ model, method }) {
  console.log("logo " + model.logoUrl);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
      maxFiles: 1,
      accept: "image/*",
      onDrop: (acceptedFiles) => {
        let imageLogo = acceptedFiles.find((image) => image !== undefined);
        if (imageLogo === undefined) return;
        let seletedImage = Object.assign(imageLogo, {
          preview: URL.createObjectURL(imageLogo),
        });
        method({ ...model, logo: seletedImage });
      },
    });
  
    return (
      <Row>
        <section>
          <div
            {...getRootProps({ className: "dropzone" })}
            style={{
              position: "relative",
              width: "150px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: ".375rem",
              }}
            >
              {(model.logo || model.logoUrl) && (
                <img
                  src={model.logo?.preview ?? model.logoUrl}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}
            </div>
            <input {...getInputProps()} />
            <p>Thả ảnh logo vào đây hoặc nhấn để chọn ảnh</p>
          </div>
        </section>
      </Row>
    );
  }