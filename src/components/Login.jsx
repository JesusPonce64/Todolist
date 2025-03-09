import { Button, Col, Input, Row} from "antd";
import React, { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth";
import { signinUser } from "../config/authCall";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined} from "@ant-design/icons";


export default function Login({ mail }) {
    const {user} = useAuth();
    const [userName,setUserName] = useState(mail);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (user) navigate("/Todolist"); 
    }, [user])

    const changeName = (inputvalue) => {
        setUserName(inputvalue.target.value);
    };
    const changePassword = (inputvalue) => {
        setPassword(inputvalue.target.value);
    };
    const login = () => {
     signinUser(userName,password);
    };

    return (
      <div>
        <h1> To Do List </h1>
        <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Input size="large"
                    prefix={<UserOutlined />}
                    placeholder="Correo de usuario" 
                    value={userName}
                    onChange={changeName}>
                </Input>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Contraseña" 
                value={password}
                onChange={changePassword}
                onPressEnter={login}
                ></Input.Password>
            </Col>
        </Row>
        <Button onClick={login} size="medium" type="primary">Login</Button>
      </div>
    );
}