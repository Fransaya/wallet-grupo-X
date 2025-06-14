import { Input as AntdInput } from "antd";
import React from "react";
import "./Input.css";

export const Input = (props) => {
  return <AntdInput className="minimalist-input" {...props} />;
};
