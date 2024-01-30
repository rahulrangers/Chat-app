import { atom } from "recoil";
import { Socket } from "socket.io-client";
export const username = atom({
    key:"username",
    default:""
})
export const recname = atom({
    key:"recname",
    default:""
})
export const senderid=  atom({
    key:"senderid",
    default:""
})
export const recieverid= atom({
    key:"recieverid",
    default:""
})
export const socketState = atom<Socket | null>({
    key: 'socketState',
    default: null,
  });