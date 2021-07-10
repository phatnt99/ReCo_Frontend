import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "reactstrap";

function Init() {
  const router = useRouter();

  useEffect(() => {
      // check token
      router.push("/login");
  }, []);

  return (
    <div
      className="main-content"
      style={{ width: "100vw", height: "100vh", display: "flex" }}
    >
      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Spinner
          type="grow"
          color="primary"
          style={{ width: "6rem", height: "6rem" }}
        />
        <h4>Đang tải trang, vui lòng đợi...</h4>
      </div>
    </div>
  );
}

export default Init;
