import { Base64 } from "js-base64";
import { isLogin, setEmailLocalStorage, setLogin } from "./localStorage";

export const POST = async (pathname: string, data: any, header: any = {}) => {
    let url = process.env.REACT_APP_API_URL + pathname;
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': isLogin() ? "Bearer " + isLogin() : '',
            ...header
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.statusText === "Unauthorized") {
            setLogin(false);
            setEmailLocalStorage("");
            window.location.reload();
        }
        return response.json();
    }
}

export const GET = async (pathname: string, header: any = {}) => {
    let url = process.env.REACT_APP_API_URL + pathname;
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': isLogin() ? "Bearer " + isLogin() : '',
            ...header
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    });
    return response.json();
}

export const GET_RECEIPT = async (pathname: string, header: any = {}) => {
    let url = process.env.REACT_APP_API_RECEIPT + pathname;
    let authString = `${process.env.REACT_APP_PUBLIC_USERNAME}:${process.env.REACT_APP_PUBLIC_PASSWORD}`
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Basic " + Base64.btoa(authString),
            ...header
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    });
    return response.json();
}
