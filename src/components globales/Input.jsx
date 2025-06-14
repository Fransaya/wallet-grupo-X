import { Input as AntdInput } from 'antd';
import React from 'react';

export const Input = (props) => {
    return (
        <AntdInput
      style={{
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #555',
      }}
      {...props}
    />
    )
}