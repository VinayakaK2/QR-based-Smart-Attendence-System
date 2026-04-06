import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/attendance">Go to Attendance</Link>
    </div>
  );
}

export default Dashboard;