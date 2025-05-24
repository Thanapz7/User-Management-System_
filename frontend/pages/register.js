import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage(){
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'viewer',
    });
    const [error, setError] = useState('');

    const handleChange = (e) =>{
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleRegister = async (e)=>{
        e.preventDefault();
        setError('');
        try{
            const res = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(form)
            });
            if(res.ok){
                router.push('/login');
            }else{
                const data = await res.json();
                setError(data.error || 'Registoration Failed')
            }
        }catch(err){
            setError('Register Fail')
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">
                <h1 className="text-xl font-bold text-center">สมัครสมาชิก</h1>
                {error && (<div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">{error}</div>)}
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input name="name" type="text" className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input name="email" type="email" className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input name="password" type="password" className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={form.password} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Role</label>
                    <select name="role" className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={form.role} onChange={handleChange}>
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">สมัครสมาชิก</button>
            </form>
        </div>
    )
};
