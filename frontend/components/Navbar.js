import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar(){
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const fetchMe = async ()=>{
            try{
                const res = await fetch("http://localhost:4000/api/auth/me",{
                    credentials: 'include'
                })
                if(res.ok){
                    const data = await res.json();
                    setUser(data)
                }
            }catch(err){

            }
        };
        fetchMe();
    },[]);

    const handleLogout = async ()=>{
        await fetch('http://localhost:4000/api/auth/logout',{
            method: 'POST',
            credentials: 'include'
        });
        router.push('/login')
    };

    return (
        <nav className="bg-white shadow px-4 py-2 flex justify-between items-center sticky top-0 z-10">
            <div className="text-lg font bold text-bluel-600 cursor-pointer" onClick={()=> router.push('/users')}> Uer Management</div>
            { user && (
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-grey-600">
                        {user.email} ({user.role})
                    </span>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">ออกจากระบบ</button>
                </div>
            )}
        </nav>
    )
}