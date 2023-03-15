import { Link } from "react-router-dom"

export const HomePage = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <button><Link to={`/login`}>
                    Log In
                </Link></button>
            <button><Link to={`/signup`}>
                    Sign Up
                </Link></button>
        </div>
    )
}