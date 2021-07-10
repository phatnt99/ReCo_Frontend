import React from "react";
import { useDropzone } from "react-dropzone";
import { Row } from "reactstrap";

export default function CarouselBuilder({ model, method, type }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((objFile) => {
        let transImage = Object.assign(objFile, {
          preview: URL.createObjectURL(objFile),
        });
        if (type == "carousel")
          method({ ...model, carousel: [...model.carousel, transImage] });
        else method({ ...model, menu: [...model.menu, transImage] });
      });
    },
  });

  const data = [...model[type], "ACTION"];

  const builder = [];

  //preData is data init from edit
  if (model[`${type}Url`]) {
    console.log("EDIT: load lại preData");
    const preData = type == 'carousel' ? [...model[`${type}Url`].split('&').filter(f => f != '')] :
      [...model[`${type}Url`].split(';').filter(f => f != '')];
    console.log(preData);
    if (preData.length > 0) {
      preData.forEach(p => {
        builder.push(
          <div
            style={{
              position: "relative",
              borderRadius: "2px",
              border: "1px solid #eeeeee",
              marginBottom: "8px",
              marginRight: "8px",
              width: "100px",
              height: "100px",
              padding: "4px",
              boxSizing: "border-box",
            }}
          >
            <i
              className="fas fa-minus-circle"
              style={{
                position: "absolute",
                cursor: "pointer",
                right: -5,
                top: -5,
              }}
              onClick={(e) => {
                //first split them to array

                if (type == 'carousel') {
                  let identity = `${type}Url`;
                  const curUrls: string[] = model[identity]?.split('&');
                  let newUrls: string[] = curUrls.filter(url => url != p);
                  let newString = newUrls.join('&');
                  method({
                    ...model,
                    "carouselUrl": newString
                  });
                }
                else {
                  let identity = `${type}Url`;
                  const curUrls: string[] = model[identity]?.split(';');
                  let newUrls: string[] = curUrls.filter(url => url != p);
                  let newString = newUrls.join(';');
                  method({
                    ...model,
                    "menuUrl": newString
                  });

                }

                console.log('new model = ' + JSON.stringify(model));
              }}
            />
            <img
              src={p}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        )
      })
    }
  }

  data.forEach((image) => {
    if (image == "ACTION")
      builder.push(
        <section>
          <div
            {...getRootProps({ className: "dropzone" })}
            style={{
              width: "100px",
              height: "100px",
            }}
          >
            <input {...getInputProps()} />
            <span>+</span>
            <span>Upload</span>
          </div>
        </section>
      );
    else
      builder.push(
        <div
          style={{
            position: "relative",
            borderRadius: "2px",
            border: "1px solid #eeeeee",
            marginBottom: "8px",
            marginRight: "8px",
            width: "100px",
            height: "100px",
            padding: "4px",
            boxSizing: "border-box",
          }}
        >
          <i
            className="fas fa-minus-circle"
            style={{
              position: "absolute",
              cursor: "pointer",
              right: -5,
              top: -5,
            }}
            onClick={(e) => {
              if (type == "carousel")
                method({
                  ...model,
                  carousel: model.carousel.filter((i) => i != image),
                });
              else
                method({
                  ...model,
                  menu: model.menu.filter((i) => i != image),
                });
            }}
          />
          <img
            src={image.preview}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      );
  });

  return <Row>{builder}</Row>;
}