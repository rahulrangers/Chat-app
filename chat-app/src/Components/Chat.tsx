import { Box, Button, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useRecoilValue } from "recoil";
import { recieverid, recname, senderid } from "../recoil/data";

import { Socket } from "socket.io-client";
import createSocketConnection from "../socket";
const Chat=()=>{
  const [msg ,setmsg]=useState("");
  const rec = useRecoilValue(recname)
  const [socket,setsocket]= useState<Socket|null>(null)
  const sender=useRecoilValue(senderid);
  const reciever = useRecoilValue(recieverid);
   const [sendermsg,setsend]=useState<string[]>([])
 const [recievermsg,setrecieve]=useState<string[]>([])
  const getmsg=async()=>{
    const resp = await fetch("http://localhost:5000/msg",{
      method:"post",
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        sender,
        reciever,
      })
    })

    const data = await resp.json()
    console.log(data);
  if(data.success){
    setsend(data.sendermsg)
    setrecieve(data.recievermsg)
  }
  }
  useEffect(()=>{
    getmsg();
    const newsocket = createSocketConnection(sender)
      newsocket.connect();
      setsocket(newsocket)
      return () => {
        newsocket.disconnect();
      };
    }, []);
useEffect(()=>{
  const handleNewChat=(data:any)=>{
    if(data.senderid==reciever && data.recieverid == sender){
      console.log("i am here")
      setsend(x=>[...x," "])
      setrecieve(x=>[...x,data.msg])
    }
  }
  socket?.on("newchat",handleNewChat)
    return () => {
      socket?.off("newchat", handleNewChat);
    };
},[sendermsg])
  const sendmsg =async()=>{

    setsend(x=>[...x,msg])
    setrecieve(x=>[...x," "])
    console.log("this is ",socket)
    socket?.emit("newchat",{
      senderid:sender,
      recieverid:reciever,
      msg:msg
    })
    const resp = await fetch("http://localhost:5000/addmsg",{
      method:"post",
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        sender,
        reciever,
        message:msg
      })
    })
    const data = await resp.json();
    console.log(data);
  }
 
return(
    <div>
    <div className="flex justify-center ">
    <div className="h-[550px] w-[800px] m-3 bg-green-300  ">
      {rec.length!=0?
      <div className="text-[34px] text-black font-semibold"> Chatting with {rec}</div>
: (<div className="text-[34px] text-white font-semibold flex justify-center"></div>)}
     
        <div className=" m-5">
          
         {sendermsg.map((x,i)=>{
          const y = recievermsg[i]
          return(
            <div className="flex justify-between">
            <div>
      {x}
              </div>
              <div>
      {y}
              </div>
            </div>
          )
         })
         }
        </div>
        <div className="m-3">
      </div>
    </div>
    </div>
    <Box
    className="flex justify-center "
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField  id="outlined-basic" label="message" variant="outlined" onChange={(e)=>setmsg(e.target.value)} />
     <Button  onClick={sendmsg} variant="contained">Send</Button>
      </Box>
  
    </div>
)
    
}
export default Chat