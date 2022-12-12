import React, { FC, useEffect } from "react";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { POST } from "utils/apiHelper";
import { message } from "utils/message";
import { getTitleWebsite } from "utils/localStorage";

export interface ChangePasswordPageProps {
    className?: string;
}

const ChangePasswordPage: FC<any> = (props) => {
    const [id, setId] = React.useState<string | null>(null);
    const [disableBtn, setDisableBtn] = React.useState(false);
    const [data, setData] = React.useState({
        password: "",
        confirm: ""
    })
    const location = useHistory();
    React.useEffect(() => {
        if (!id) {
            setId(location.location.search.split("=")[1]);
        }
    }, [id])
    const handleChangePassword = async (event: any) => {
        event.preventDefault();
        setDisableBtn(true)
        let account = {
            newPassword: data.password,
            confirmPassword: data.confirm
        }
        try {
            let res = await POST("/customers/change-password/" + id, account)
            if (res) {
                if (res.success) {
                    if (res.result) {
                        message("success", "Password berhasil diubah");
                        location.push("/login");
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
    return (
        <div data-nc-id="ChangePasswordPage">
            <Helmet>
                <title>{getTitleWebsite()} - Change Password</title>
            </Helmet>
            <div className="container mb-24 lg:mb-32">
                <h2 className="my-10 font-bold flex items-center text-xl text-center leading-[115%] md:text-xl md:leading-[115%] text-neutral-900 dark:text-neutral-100 justify-center">
                    Konfirmasi Password Baru
                </h2>
                <div className="w-full md:w-1/3 mx-auto space-y-6">
                    {/* FORM */}
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleChangePassword}>
                        <label className="block">
                            <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                                Password
                            </span>
                            <Input
                                type="password"
                                className="mt-1"
                                onChange={(e: any) => setData({
                                    ...data,
                                    password: e.target.value
                                })}
                            />
                        </label>
                        <label className="block">
                            <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                                Konfirmasi Password
                            </span>
                            <Input
                                type="password"
                                className="mt-1"
                                onBlur={(e: any) => {
                                    if (data.password !== e.target.value) {
                                        message("error", "Password tidak sama!");
                                    }
                                }}
                                onChange={(e: any) => setData({
                                    ...data,
                                    confirm: e.target.value
                                })}
                            />
                        </label>
                        <ButtonPrimary disabled={disableBtn} type="submit">Ganti Password</ButtonPrimary>
                    </form>
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


export default connect(mapStateToProps)(ChangePasswordPage)
