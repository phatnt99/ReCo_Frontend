import springFetch from "./springFetch";
import spring from "../springRoute";

const AuthService = {
    login: (username: any, password: any) => {
        return springFetch(`${spring.login}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
    },
    register: (username: any, email: any, password: any) => {
        return springFetch(`${spring.register}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                role: 'ROWNER'
            })
        })
    },
    changePwd: (data: any) => {
        return springFetch(`${spring.pwd}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }, true);
    }
    ,
    logout: () => {
        localStorage.setItem("auth", null);
        localStorage.setItem("authId", null);
        localStorage.setItem("authRole", null);
    },
    getProfile: () => {
        return springFetch(`${spring.me}`, {}, true);
    }
}

export default AuthService;