import React, {useState, useEffect} from 'react'
import './Signin.scss'
import { Input, Button, Form, notification } from 'antd';
import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import { login } from '../../actions/auth';

const Signin = (props) => {

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, error, title) => {
        api[type]({
          message: title,
          description: error.msg,
        });
    };

    useEffect(() => {
        props.errors.map((item, index) => openNotificationWithIcon('error',props.errors[index], "Errors"))
    }, [props.errors])

    useEffect(() => {
        if(props.isAuthenticated === true){
            if(!props.role)
                navigate('/main', {replace: true})
            else navigate('/admin', {replace: true})
        }
    }, [props.isAuthenticated])

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onFinish = (e) => {
        props.login(email, password);
    };

    return(
        <div className='login-container'>
            {contextHolder}
            <div className="box">
                <h2>Login</h2>
                <Form
                    name = "basic"
                    autoComplete='off'
                    onFinish={onFinish}
                    layout = {"vertical"}
                >
                    <Form.Item
                        label = "Email"
                        rules={[
                            {
                              required: true,
                              message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input 
                            type="email"
                            name = "email"
                            placeholder='Input Email'
                            value = {email}
                            onChange = {onChange}
                        
                        />
                    </Form.Item>
                    <Form.Item
                        label = "Password"
                        rules={[
                            {
                              required: true,
                              message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input 
                            type="password"
                            name = "password"
                            placeholder='Input Password'
                            value = {password}
                            onChange = {onChange}
                        
                        />
                    </Form.Item>
                    <Button
                        type = "primary"
                        htmlType='submit' 
                    >
                        Login    
                    </Button>
                </Form>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.auth.errors,
    role: state.auth.role
})

export default connect(mapStateToProps, {login} )(Signin)