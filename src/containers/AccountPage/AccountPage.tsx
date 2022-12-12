import Label from "components/Label/Label";
import React, { FC } from "react";
import Avatar from "shared/Avatar/Avatar";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Textarea from "shared/Textarea/Textarea";
import CommonLayout from "./CommonLayout";
import { Helmet } from "react-helmet";
import { message } from "utils/message";
import { POST } from "utils/apiHelper";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getEmail, getStorage } from "utils/localStorage";
import { CONFIG_STR } from "contains/contants";


export interface AccountPageProps {
  className?: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const [dataProfile, setDataProfile] = React.useState({
    username: '',
    gender: '',
    email: '',
    identity: '',
    city: '',
    telephone: ''
  });
  const [disableBtn, setDisableBtn] = React.useState(false);
  React.useEffect(() => {
    if (dataProfile.email === '') {
      getProfile();
    }
  }, [dataProfile]);
  const getProfile = async () => {
    try {
      let config = getStorage(CONFIG_STR);
      if (config) {
        let data = {
          email: getEmail(),
          cid: config.cid
        }
        let res = await POST("/customers/index", data)
        if (res) {
          if (res.success) {
            if (res.result) {
              let { email, phone, name, gender, nik, tcName } = res.result;
              setDataProfile({
                username: name,
                gender: gender,
                email: email,
                identity: nik,
                city: tcName,
                telephone: phone
              })
            }
          } else {
            message("error", res.message);
          }
        }
      }
    } catch (error) {
      message("error", error);
    }
  }
  const updateProfile = async (profile: any) => {
    setDisableBtn(true)
    let config = getStorage(CONFIG_STR);
    if (config) {
      let data =
      {
        email: profile?.email,
        name: profile?.username,
        nik: profile?.identity,
        phone: profile?.telephone,
        gender: profile?.gender,
        cid: config.cid
      }
      try {
        let res = await POST("/customers/update", data)
        if (res) {
          if (res.success) {
            if (res.result) {
              message("success", "Berhasil update profil!");
              getProfile();
              setTimeout(() => {
                setDisableBtn(false)
              }, 5000);
            }
          } else {
            message("error", res.message);
            setTimeout(() => {
              setDisableBtn(false)
            }, 5000);
          }
        }
      } catch (error) {
        message("error", error);
        setTimeout(() => {
          setDisableBtn(false)
        }, 5000);
      }
    }
  }
  const AccountSchema = Yup.object().shape({
    username: Yup.string()
      .min(4, 'Too Short!')
      .max(30, 'Too Long!')
      .required('Required'),
    gender: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    identity: Yup.string()
      .min(2, 'Too Short!')
      .max(30, 'Too Long!')
      .required('Required'),
    city: Yup.string()
      .min(2, 'Too Short!')
      .max(30, 'Too Long!')
      .required('Required'),
    telephone: Yup.string()
      .min(8, 'Too Short!')
      .max(15, 'Too Long!')
      .required('Required'),

  });

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <CommonLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold">Informasi Akun</h2>
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex items-start">
              <div className="relative rounded-full overflow-hidden flex">
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mt-1 text-xs">Change Image</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            {
              dataProfile.email && dataProfile.email !== "" ?
                <Formik
                  initialValues={{
                    username: dataProfile.username,
                    gender: dataProfile.gender,
                    email: dataProfile.email,
                    identity: dataProfile.identity,
                    city: dataProfile.city,
                    telephone: dataProfile.telephone
                  }}
                  validationSchema={AccountSchema}
                  onSubmit={values => {
                    // same shape as initial values
                    updateProfile(values);
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="flex-grow mt-10 md:mt-0 md:pl-16">
                      <div className="w-full">
                        <div className="flex flex-col mt-4">
                          <Label>Nama Lengkap</Label>
                          <Field
                            name="username"
                            style={{
                              paddingLeft: "15px",
                              paddingTop: "10px",
                              paddingBottom: "10px"
                            }}
                            className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent" />
                          {errors.username && touched.username ? (
                            <div className="text-red-600 text-sm">{errors.username}</div>) : null}
                        </div>
                        {/* ---- */}
                        <div className="flex flex-col mt-4">
                          <Label>Jenis Kelamin</Label>
                          <Field as="select" name="gender"
                            style={{
                              paddingLeft: "15px",
                              paddingTop: "10px",
                              paddingBottom: "10px"
                            }}
                            className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent">
                            <option></option>
                            <option value="Male">Laki-laki</option>
                            <option value="Female">Perempuan</option>
                          </Field>
                          {errors.gender && touched.gender ? (
                            <div className="text-red-600 text-sm">{errors.gender}</div>) : null}
                        </div>
                        {/* ---- */}
                        <div className="flex flex-col mt-4">
                          <Label>Email</Label>
                          <Field name="email"
                            style={{
                              paddingLeft: "15px",
                              paddingTop: "10px",
                              paddingBottom: "10px"
                            }}
                            className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent" />
                          {errors.email && touched.email ? (
                            <div className="text-red-600 text-sm">{errors.email}</div>) : null}
                        </div>
                        {/* ---- */}
                        <div className="flex flex-col mt-4">
                          <Label>Nomor Identitas Kependudukan</Label>
                          <Field name="identity"
                            style={{
                              paddingLeft: "15px",
                              paddingTop: "10px",
                              paddingBottom: "10px"
                            }}
                            className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent" />
                          {errors.identity && touched.identity ? (
                            <div className="text-red-600 text-sm">{errors.identity}</div>) : null}
                        </div>
                        {/* ---- */}
                        <div className="flex flex-col mt-4">
                          <Label>Kota Asal</Label>
                          <Field name="city"
                            style={{
                              paddingLeft: "15px",
                              paddingTop: "10px",
                              paddingBottom: "10px"
                            }}
                            className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent" />
                          {errors.city && touched.city ? (
                            <div className="text-red-600 text-sm">{errors.city}</div>) : null}
                        </div>
                        {/* ---- */}
                        <div className="flex flex-col mt-4">
                          <Label>Telepon</Label>
                          <Field name="telephone"
                            style={{
                              paddingLeft: "15px",
                              paddingTop: "10px",
                              paddingBottom: "10px"
                            }}
                            className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent" />
                          {errors.telephone && touched.telephone ? (
                            <div className="text-red-600 text-sm">{errors.telephone}</div>) : null}
                        </div>
                        <div className="pt-2 mt-4">
                          <ButtonPrimary disabled={disableBtn} type="submit">Update info</ButtonPrimary>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik> : null
            }
          </div>
        </div>
      </CommonLayout>

    </div>
  );
};

export default AccountPage;
