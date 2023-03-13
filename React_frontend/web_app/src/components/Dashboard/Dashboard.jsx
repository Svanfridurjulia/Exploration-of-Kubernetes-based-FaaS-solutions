import { pythonFunction } from "../../services/FunctionServices";

export const Dashboard = () => {

    const handleClick = async (event) => {
        event.preventDefault();
        const data = {"message": "darnit you clicked me!!!!"}
        const response = await pythonFunction(data);
        console.log(response);
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleClick}>do not click me!!!!</button>
        </div>
    )
}