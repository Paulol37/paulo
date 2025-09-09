import { useAuth } from "../context/AuthContext";

export default function UsersPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Welcome {user?.email}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
