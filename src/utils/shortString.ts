import React, { FC } from "react";

export const shortString = (str:string, limit:number) => {
    let strLength = str.length;
    let final = ""
    if (strLength > limit) {
        final = str.slice(0, limit) + " ...";
    }else{
        final = str;
    }
    return final;
}
