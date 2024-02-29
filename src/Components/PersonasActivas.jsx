import { useAuth } from "../context/authContext";

export default function PersonasActivas() {
  const auth = useAuth();
  const avatars = [auth.user.photoURL, auth.user.photoURL, auth.user.photoURL];

  return (
    <div className="text-sm">
      <div className="rounded-full flex">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        ))}
      </div>
    </div>
  );
}
