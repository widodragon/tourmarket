import React, { FC, useEffect } from "react";
import facebookSvg from "images/Facebook.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Title from "../../data/title";
import { getStorage, getTitleWebsite, isLogin, setLogin } from "utils/localStorage";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { POST } from "utils/apiHelper";
import { message } from "utils/message";
import { CONFIG_STR } from "contains/contants";

export interface PageForgetProps {
    className?: string;
}

const forgetSocials = [
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

const ForgetPage: FC<PageForgetProps> = ({ className = "" }) => {
    const [email, setEmail] = React.useState("");
    const location = useHistory();
    const handleForget = async (event: any) => {
        event.preventDefault();
        let config = getStorage(CONFIG_STR);
        if(config){
            let data = {
                email: email,
                cid: config.cid
            }
            try {
                let res = await POST("/customers/forgotpassword", data)
                if (res) {
                    if (res.success) {
                        if (res.result) {
                            message("success", "Silahkan periksa email anda");
                            location.push("/login");
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
        <div className={`nc-PageForget ${className}`} data-nc-id="PageForget">
            <Helmet>
                <title>{getTitleWebsite()} - Forgot</title>
            </Helmet>
            <div className="container mb-24 lg:mb-32">
                <h2 className="my-10 font-bold flex items-center text-xl text-center leading-[115%] md:text-xl md:leading-[115%] text-neutral-900 dark:text-neutral-100 justify-center">
                    Lupa Password
                </h2>
                <div className="w-full md:w-1/3 mx-auto space-y-6">
                    {/* FORM */}
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleForget}>
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Email
                            </span>
                            <Input
                                type="email"
                                placeholder="example@example.com"
                                className="mt-1"
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                            />
                        </label>
                        <ButtonPrimary type="submit">Reset Password</ButtonPrimary>
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


export default connect(mapStateToProps)(ForgetPage)
