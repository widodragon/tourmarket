import { LOGIN_STORAGE, DATA_CART, EMAIL, USER_STORAGE, CONFIG_STR, INQUIRY_BODY } from "../contains/contants";

export const getStorage = (name: string) => {
    let data = localStorage.getItem(name);
    if (data) {
        return JSON.parse(data);
    } else {
        return false;
    }
}

export const setStorageLocalStorage = (name: string, data: any) => {
    localStorage.setItem(name, JSON.stringify(data));
}

export const deleteLocalStorage = (name: string) => {
    localStorage.removeItem(name);
}

export const setRequestInquiry = (data: any) => {
    localStorage.setItem(INQUIRY_BODY, JSON.stringify(data));
}

export const getRequestInquiry = () => {
    let data = localStorage.getItem(INQUIRY_BODY);
    if (data) {
        let json = JSON.parse(data);
        return json
    } else {
        return false
    }
}

export const deleteRequestInquiry = () => {
    localStorage.removeItem(INQUIRY_BODY);
}

export const setEmailLocalStorage = (data: string) => {
    localStorage.setItem(EMAIL, JSON.stringify(data));
}

export const getTitleWebsite = () => {
    let data = localStorage.getItem(CONFIG_STR);
    if (data) {
        let json = JSON.parse(data);
        return json.websiteName
    } else {
        return ""
    }
}

export const setUserStorage = (data: any) => {
    localStorage.setItem(USER_STORAGE, JSON.stringify(data));
}

export const getUserStorage = () => {
    let data = localStorage.getItem(USER_STORAGE);
    if (data) {
        return JSON.parse(data);
    } else {
        return false;
    }
}

export const deleteUserStorage = () => {
    localStorage.removeItem(USER_STORAGE);
}

export const getEmail = () => {
    let email = localStorage.getItem(EMAIL)
    if (email) {
        return JSON.parse(email);
    } else {
        return "";
    }
}

export const isLogin = () => {
    let login = localStorage.getItem(LOGIN_STORAGE)
    if (login) {
        return JSON.parse(login);
    } else {
        return false;
    }
}

export const setLogin = (state: boolean) => {
    localStorage.setItem(LOGIN_STORAGE, JSON.stringify(state));
}

export const addToCart = (cartProduct: any) => {
    let cart = localStorage.getItem(DATA_CART);
    if (cart) {
        localStorage.setItem(DATA_CART, JSON.stringify({ ...JSON.parse(cart), ...cartProduct }))
    } else {
        localStorage.setItem(DATA_CART, JSON.stringify(cartProduct));
    }
}

export const getCartProduct = () => {
    let cart = localStorage.getItem(DATA_CART);
    if (cart) {
        return JSON.parse(cart);
    } else {
        return {}
    }
}
