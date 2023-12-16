import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signin, Construction, Admin} from "../containers";

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path = "/" element = {<Signin />} />
                <Route path = "/signin" element = {<Signin />} />
                <Route path = "/main" element = {<Construction />} />
                <Route path = "/admin" element = {<Admin />} />
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes