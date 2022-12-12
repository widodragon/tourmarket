import React, { FC, useEffect } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Title from "../../data/title";
import { isLogin, setLogin, setEmailLocalStorage, getStorage, setStorageLocalStorage, setUserStorage, getTitleWebsite } from "utils/localStorage";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { POST } from "utils/apiHelper";
import { message } from "utils/message";
import { CONFIG_STR, CONFIG_TCS } from "contains/contants";
import { useFormik } from 'formik';
import * as Yup from 'yup';

export interface PageLoginProps {
  className?: string;
}

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const [disableBtn, setDisableBtn] = React.useState(false);
  const [securePass, setSecurePass] = React.useState(true);
  const location: any = useHistory();
  const formik = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .max(8, 'Maksimal 8 karakter!')
        .required('Required'),
      email: Yup.string().email('Email tidak valid! ').required('Required'),
    }),
    onSubmit: values => {
      handleLogin(values);
    },
  });
  React.useEffect(() => {
    if (isLogin()) {
      location.push("/");
    }
  }, [])
  const handleLogin = async (body: any) => {
    setDisableBtn(true);
    let config = getStorage(CONFIG_STR);
    if (config) {
      let data = {
        email: body.email,
        password: body.password,
        cid: config.cid
      }
      try {
        let res = await POST("/customers/loginv2", data)
        if (res) {
          if (res.success) {
            if (res.result) {
              setEmailLocalStorage(res.result.email);
              setUserStorage(res.result);
              setLogin(res.result.token);
              POST("/tcs-config/list/index", {
                cid: config.cid,
                hirarki: ""
              }).then((cfg) => {
                if (cfg.result.length !== 0) {
                  setStorageLocalStorage(CONFIG_TCS, cfg.result[0]);
                }
                message("success", "Login success");
                if (location.location.pathname === "/login") {
                  setTimeout(() => {
                    location.push("/");
                  }, 1000)
                } else {
                  setTimeout(() => {
                    let pathname = `${location.location.pathname}${location.location.search ? location.location.search : ""}`
                    location.push(pathname, {
                      data: location?.location?.state?.data
                    });
                    setDisableBtn(false);
                  }, 1000)
                }
              })
            }
          } else {
            message("error", res.message);
            setTimeout(() => {
              setDisableBtn(false);
            }, 5000);
          }
        }
      } catch (error) {
        message("error", error);
        setTimeout(() => {
          setDisableBtn(false);
        }, 5000);
      }
    }
  }
  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>{getTitleWebsite()} - Login</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-10 font-bold flex items-center text-xl text-center leading-[115%] md:text-xl md:leading-[115%] text-neutral-900 dark:text-neutral-100 justify-center">
          Masuk
        </h2>
        <div className="w-full md:w-1/3 mx-auto space-y-6">
          <form className="grid grid-cols-1 gap-6" onSubmit={formik.handleSubmit}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email
              </span>
              <Input
                type="text"
                placeholder="Email"
                className="mt-1"
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-400 text-sm mt-2">{formik.errors.email}</div>
              ) : null}
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link to="/forgot-pass" className="text-sm">
                  Lupa password?
                </Link>
              </span>
              <div className="relative">
                <Input
                  type={securePass ? "password" : "text"}
                  placeholder="Password"
                  className="mt-1"
                  onChange={(e) => formik.setFieldValue("password", e.target.value)}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <div onClick={() => setSecurePass(!securePass)} className="cursor-pointer absolute right-0 top-0 bottom-0 mt-auto mb-auto text-center w-10 flex flex-row justify-center items-center">
                  {
                    securePass ? <i className="la la-eye-slash text-xl" /> : <i className="la la-eye text-xl" />
                  }
                </div>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-400 text-sm mt-2">{formik.errors.password}</div>
              ) : null}
            </label>
            <ButtonPrimary disabled={disableBtn} type="submit">Lanjut</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Pengguna baru? {` `}
            <Link to="/signup">Buat akun</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    ...state
  }
}


export default connect(mapStateToProps)(PageLogin)
