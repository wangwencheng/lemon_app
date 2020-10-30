import {BEARER_TOKEN} from "./constant";

export function getToken(str) {
  const tokenString =
    typeof str === 'undefined' ? localStorage.getItem(BEARER_TOKEN): str;
    return tokenString;
}

export function setToken(token) {
  if(token){
    return localStorage.setItem(BEARER_TOKEN, token);
  }
}
