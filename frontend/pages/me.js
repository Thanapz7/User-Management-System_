import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          credentials: "include",
        });
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <h1 className="text-xl font-bold mb-4 text-center">ข้อมูลผู้ใช้งาน</h1>
          {user ? (
            <div className="space-y-3 text-sm">
              <p><strong>ชื่อ:</strong> {user.name}</p>
              <p><strong>อีเมล:</strong> {user.email}</p>
              <p><strong>โรล:</strong> {user.role}</p>
              <p><strong>สร้างเมื่อ:</strong> {new Date(user.createAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>ไม่พบข้อมูลผู้ใช้</p>
          )}
        </div>
      </div>
    </>
  );
}
