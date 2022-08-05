import { getQueryValueByKey, setAppUserInfo } from "@/utils";
import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Image, Input, Layout, Row } from "antd";
import React, { useCallback, useState } from "react";
import { useHistory, useLocation } from "react-router";
import styles from "./index.module.less";

const FormItem = Form.Item;

export default function Login() {
  const [form] = Form.useForm();
  const [captchaUrl, setCaptchaUrl] = useState("");

  const history = useHistory();
  const location = useLocation();

  const updateCaptchaUrl = useCallback(() => {
    setCaptchaUrl("");
    form.resetFields(["imgcaptcha"]);
  }, []);

  const onLogin = useCallback((values) => {
    console.log(values);

    const userInfo = { phone: values.phone };
    setAppUserInfo(userInfo);

    const from = getQueryValueByKey("from", location.search) as
      | string
      | undefined;
    history.replace(from ?? "/home");
  }, []);

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Content className={styles.layout_content}>
        <h1 className={styles.product_name}></h1>

        <Form form={form} className={styles.form} onFinish={onLogin}>
          <FormItem
            name="phone"
            rules={[{ required: true, message: "手机号不能为空" }]}
          >
            <Input
              placeholder="请输入手机号"
              size="large"
              prefix={<UserOutlined />}
              maxLength={11}
            />
          </FormItem>

          <FormItem
            name="password"
            rules={[{ required: true, message: "密码不能为空" }]}
          >
            <Input.Password
              placeholder="请输入密码"
              size="large"
              prefix={<LockOutlined />}
            />
          </FormItem>

          <Row gutter={12}>
            <Col flex={1}>
              <FormItem
                name="imgcaptcha"
                rules={[{ required: true, message: "验证码不能为空" }]}
              >
                <Input
                  placeholder="请输入验证码"
                  size="large"
                  maxLength={6}
                  prefix={<SafetyCertificateOutlined />}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <Image
                title="点击刷新验证码"
                preview={false}
                width="100%"
                height={40}
                style={{ cursor: "pointer" }}
                src={captchaUrl}
                onClick={updateCaptchaUrl}
              />
            </Col>
          </Row>

          <Button
            style={{ marginTop: 12 }}
            type="primary"
            size="large"
            block
            htmlType="submit"
          >
            登录
          </Button>
        </Form>
      </Layout.Content>
      <Layout.Footer></Layout.Footer>
    </Layout>
  );
}
