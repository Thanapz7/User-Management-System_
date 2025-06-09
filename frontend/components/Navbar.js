import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchMe = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/me", {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        console.log("me:", data);
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };
  fetchMe();
}, []);


  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/login');
  };

  return (
    <nav className="bg-sky-800 shadow px-4 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="text-xl text-white font-bold cursor-pointer" onClick={() => router.push('/users')}>ระบบจัดการผู้ใช้งาน (User Management System)</div>
      
      {!loading && user && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white">{user.email} ({user.role})</span>
          <button onClick={() => router.push('/me')} className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-white transition">โปรไฟล์ของฉัน</button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"><i className="fa-solid fa-right-from-bracket pe-2" /> ออกจากระบบ</button>
        </div>
      )}
    </nav>
  );
}
