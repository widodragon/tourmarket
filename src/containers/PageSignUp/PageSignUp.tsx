import React, { FC } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Link, useHistory } from "react-router-dom";
import styles from "./Signup.module.css";
import Title from "../../data/title";
import { message } from "utils/message";
import { POST } from "utils/apiHelper";
import { getStorage, getTitleWebsite } from "utils/localStorage";
import { CONFIG_STR } from "contains/contants";
import { useFormik } from 'formik';
import * as Yup from 'yup';

export interface PageSignUpProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Google",
    href: "#",
    icon: googleSvg,
  },
];
const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [disableBtn, setDisableBtn] = React.useState(false);
  const [securePass, setSecurePass] = React.useState(true);

  const location = useHistory();
  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      email: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(30, 'Maksimal 30 karakter!')
        .required('Required'),
      password: Yup.string()
        .max(8, 'Maksimal 8 karakter!')
        .required('Required'),
      email: Yup.string().email('Email tidak valid! ').required('Required'),
    }),
    onSubmit: values => {
      handleRegister(values);
    },
  });
  const handleChange = (data: any) => {
    setSelectedDay(data)
  }
  const handleRegister = async (data: any) => {
    let config = getStorage(CONFIG_STR);
    setDisableBtn(true);
    if (config) {
      let account = {
        name: data.name,
        email: data.email,
        password: data.password,
        cid: config.cid
      }
      try {
        let res = await POST("/customers/register", account)
        if (res) {
          if (res.success) {
            if (res.result) {
              message("success", "Register berhasil, silahkan periksa email anda!");
              setTimeout(() => {
                setDisableBtn(false);
                location.push("/login");
              }, 1000)
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
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>{getTitleWebsite()} - Register</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-10 font-bold flex items-center text-lg text-center leading-[115%] md:text-lg md:leading-[115%] text-neutral-900 dark:text-neutral-100 justify-center">
          Daftar sekarang dan dapatkan manfaatnya
        </h2>
        <div className="w-full md:w-2/4 mx-auto space-y-6 ">
          <form className="grid grid-cols-1 gap-6" onSubmit={formik.handleSubmit}>
            <label htmlFor="name" className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Nama Lengkap
              </span>
              <Input
                type="text"
                placeholder="Nama lengkap"
                className="mt-1"
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-400 text-sm mt-2">{formik.errors.name}</div>
              ) : null}
            </label>
            <label htmlFor="email" className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-400 text-sm mt-2">{formik.errors.email}</div>
              ) : null}
              {/* <div className="flex flex-row justify-end">
                <button onClick={() => checkEmail()} type="button" className="text-xs text-white px-2 py-1 mt-2 bg-blue-500 rounded-lg">Check Email</button>
              </div> */}
            </label>
            <label htmlFor="password" className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
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
            <ButtonPrimary disabled={disableBtn} type="submit">SAYA SETUJU, LANJUT DAFTAR</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Sudah punya akun? {` `}
            <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
