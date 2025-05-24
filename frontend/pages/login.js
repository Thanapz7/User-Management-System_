import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const res = await fetch('http://localhost:4000/api/auth/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({email, password})
            });
            if(res.ok){
                router.push('/users');
            }else{
                const data = await res.json();
                setError(data.error || 'Login Failed')
            }
        }catch(err){
            setError('error')
        }
    }
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">
                <h1 className="text-xl font-bold text-center">ล็อกอิน</h1>
                { error && (<div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">{error}</div>)}
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" className="w-full border border-grey-300 rounded px-3 py-2 mt-1" value={email} onChange={(e)=>setEmail(e.target.value)} required /> 
                </div>
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input type="password" className="w-full border border-grey-300 rounded px-3 py-2 mt-1" value={password} onChange={(e)=>setPassword(e.target.value)} required /> 
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">ล็อกอิน</button>
                <p className="mt-4 text-center text-sm text-gray-600">ยังไม่มีบัญชี? 
                    <button onClick={()=>router.push("/register")} className="text-blue-600 hover:underline"> สมัครสมาชิก</button>
                </p>
            </form>
        </div>
    )
}