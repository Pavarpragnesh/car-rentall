
import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const { setShowLogin, axios, setToken, navigate, setUser } = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();

            let url = `/api/user/${state}`;

            if (state === "forgot") {
                url = "/api/user/forgot-password";
            }

            const payload =
                state === "register"
                    ? { name, email, password }
                    : state === "forgot"
                    ? { email, newPassword: password }
                    : { email, password };

            const { data } = await axios.post(url, payload);

            if (data.success) {

                // ✅ Forgot Password
                if (state === "forgot") {
                    toast.success("Password updated! Please login.");
                    setState("login");
                    setPassword("");
                    return;
                }

                // ✅ Normal Login/Register
                setToken(data.token)
                localStorage.setItem('token', data.token)
                setUser({ role: data.role })

                if (data.role === "admin") {
                    navigate('/admin')
                } else if (data.role === "owner") {
                    navigate('/owner')
                } else {
                    navigate('/')
                }

                setShowLogin(false)

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>

            <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">

                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : state === "register" ? "Sign Up" : "Forgot Password"}
                </p>

                {/* Name (only register) */}
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="type here"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            type="text"
                            required
                        />
                    </div>
                )}

                {/* Email */}
                <div className="w-full">
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="email"
                        required
                    />
                </div>

                {/* Password / New Password */}
                <div className="w-full">
                    <p>{state === "forgot" ? "New Password" : "Password"}</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="password"
                        required
                    />
                </div>

                {/* ✅ Forgot Password LINK (ONLY ADDED) */}
                {state === "login" && (
                    <p
                        onClick={() => {
                            setState("forgot");
                            setPassword("");
                        }}
                        className="text-primary cursor-pointer text-xs"
                    >
                        Forgot Password?
                    </p>
                )}

                {/* Switch */}
                {state === "register" ? (
                    <p>
                        Already have account?{" "}
                        <span onClick={() => setState("login")} className="text-primary cursor-pointer">
                            click here
                        </span>
                    </p>
                ) : state === "login" ? (
                    <p>
                        Create an account?{" "}
                        <span onClick={() => setState("register")} className="text-primary cursor-pointer">
                            click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Back to{" "}
                        <span onClick={() => setState("login")} className="text-primary cursor-pointer">
                            Login
                        </span>
                    </p>
                )}

                <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register"
                        ? "Create Account"
                        : state === "forgot"
                        ? "Update Password"
                        : "Login"}
                </button>

            </form>
        </div>
    )
}

export default Login

