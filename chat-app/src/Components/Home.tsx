import { useRecoilState, useRecoilValue } from "recoil";
import { recieverid, senderid,  username } from "../recoil/data";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import createSocketConnection from "../socket";

interface user {
  _id: string;
  name: String;
  is_online: Boolean;
}
const Home = () => {
 
  const navigate = useNavigate();
  const sender = useRecoilValue(senderid);
  const [recieve, setrecieve] = useRecoilState(recieverid);
  const name = useRecoilValue(username);
  const [users, setusers] = useState<user[]>([]);
  const getusers = async () => {
    const res = await fetch("http://localhost:5000/users", {
      method: "get"
    });
    const data = await res.json();
    console.log(data);
    setusers(data.users);
  };
    useEffect(() => {
     getusers()
     console.log(sender)
     const socket = createSocketConnection(sender)
      socket.connect();
      return () => {
        socket.disconnect();
      };
    }, []);
  return (
    <div>
      <div className="flex justify-center text-[40px] bg-blue-600 text-white shadow-md shadow-black">CHAT-BOX</div>
     <div className="shadow-lg shodow-black border-black bg-violet-600 border-2 w-max-screen items-center flex justify-between text-white">
      <div className=" text-[24px] font-bold p-3 ">Contacts</div>
<div className="text-[24px] font-bold px-2 mx-[200px] ">Hi {name} Chat with your contacts!</div>
      </div>
      <div className="grid grid-cols-4">
      <div className="h-screen col-span-1  bg-slate-400">
      {users.map(x => {
        if (x.name != name) {
          return (
              <Button variant="contained"
              className="m-5 w-[317px]  h-14"
                onClick={() => {
                  setrecieve(x._id);
                  navigate(`/chat/${sender.slice(0, 4) + recieve.slice(0, 4)}`);
                }}
              >
                {x.name}
                {x.is_online?(<div className="m-3 text-green-300 text-[15px] font-bold">online</div>):
              <div className="text-red-300 m-3 text-[15px] font-bold">offline</div>}
              </Button> 
          );
        }
      })
      }
      </div>
      <div className="bg-green-600 col-span-3 h-screen">
        
      </div>
      </div>
    </div>
  );
};
export default Home;
