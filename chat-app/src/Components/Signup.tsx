import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { senderid, username } from "../recoil/data";

export default function Signup() {
    const [name,setname]= useRecoilState(username)
    const [sender,setsender] = useRecoilState(senderid)
    const navigate = useNavigate()
  const handleSubmit = async(event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const resp=await fetch("http://localhost:5000/signin",{
        method:"post",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "name":data.get("email"),
            "password":data.get("password")
        })
    })
    const res = await resp.json()
    console.log(res)
    setname(res.name)
    setsender(res._id)
    navigate("/")
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{  
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Signup
          </Button>
          <Grid container>
            <Grid item xs>
             
            </Grid>
            <Grid item>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}