import Label from "components/Label/Label";
import React from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import { POST } from "utils/apiHelper";
import { getEmail, getStorage, setEmailLocalStorage, setLogin } from "utils/localStorage";
import { message } from "utils/message";
import CommonLayout from "./CommonLayout";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CONFIG_STR } from "contains/contants";

const AccountPass = () => {
  const PasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(2, 'Too Short!')
      .max(8, 'Too Long!')
      .required('Required'),
    newPassword: Yup.string()
      .min(2, 'Too Short!')
      .max(8, 'Too Long!')
      .required('Required'),
    confirmPassword: Yup.string()
      .min(2, 'Too Short!')
      .max(8, 'Too Long!')
      .required('Required'),

  });
  const updatePassword = async (states: any) => {
    let config = getStorage(CONFIG_STR);
    if(config){
      let data =
      {
        email: getEmail(),
        cid: config.cid,
        oldPassword: states.password,
        newPassword: states.newPassword,
        confirmPassword: states.confirmPassword
      }
      try {
        let res = await POST("/customers/update/password", data)
        if (res) {
          if (res.success) {
            if (res.result) {
              message("success", "Password berhasil diubah");
              setLogin(false);
              setEmailLocalStorage("");
              setTimeout(()=>{
                window.location.reload();
              },1000);
            }
          } else {
            message("error", res.message);
          }
        }
      } catch (error) {
        message("error", error);
      }
    }
  }

  return (
    <div>
      <CommonLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold">Update your password</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className=" max-w-xl space-y-6">
            <Formik
              initialValues={{
                password: '',
                newPassword: '',
                confirmPassword: ''
              }}
              validationSchema={PasswordSchema}
              onSubmit={values => {
                // same shape as initial values
                updatePassword(values);
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="flex flex-col mt-4">
                    <Label>Old password</Label>
                    <Field
                      name="password"
                      type="password"
                      style={{
                        paddingLeft: "15px",
                        paddingTop: "10px",
                        paddingBottom: "10px"
                      }}
                      className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent" />
                    {errors.password && touched.password ? (
                      <div className="text-red-600 text-sm">{errors.password}</div>) : null}
                  </div>
                  <div className="flex flex-col mt-4">
                    <Label>New password</Label>
                    <Field
                      name="newPassword"
                      type="password"
                      style={{
                        paddingLeft: "15px",
                        paddingTop: "10px",
                        paddingBottom: "10px"
                      }}
                      className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent" />
                    {errors.newPassword && touched.newPassword ? (
                      <div className="text-red-600 text-sm">{errors.newPassword}</div>) : null}
                  </div>
                  <div className="flex flex-col mt-4">
                    <Label>Confirm password</Label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      style={{
                        paddingLeft: "15px",
                        paddingTop: "10px",
                        paddingBottom: "10px"
                      }}
                      className="sm:rounded-2xl pt-3 focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent" />
                    {errors.confirmPassword && touched.confirmPassword ? (
                      <div className="text-red-600 text-sm">{errors.confirmPassword}</div>) : null}
                  </div>
                  <div className="pt-2 mt-4">
                    <ButtonPrimary type="submit">Update password</ButtonPrimary>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </CommonLayout>

    </div>
  );
};

export default AccountPass;
