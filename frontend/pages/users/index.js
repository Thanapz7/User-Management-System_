import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from '../../components/Navbar'

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({name: '', email: '', password: '', role: 'viewer'});
    const [editingId, setEditingId] = useState(null)
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(()=>{
        const fetchMeAndUsers = async ()=>{
            try{
                const meRes = await fetch('http://localhost:4000/api/auth/me',{
                    credentials: 'include'
                })
                if(meRes.status === 401){
                    router.push('/login');
                    return
                }

                const meData = await meRes.json();
                setMe(meData);

                const usersRes = await fetch('http://localhost:4000/api/users',{
                    credentials: 'include'
                })
                const usersData = await usersRes.json();
                setUsers(usersData);
            }catch(err){
                console.error('Failed to fetch users', err)
            }finally{
                setLoading(false)
            }
        }
        fetchMeAndUsers();
    }, [router]);

    const handleFormChange = (e)=>{
      setForm({...form, [e.target.name]: e.target.value});
    }

    const handleEditClick = (user)=>{
      setEditingId(user.id);
      setForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    }

    const handleSubmit = async(e)=>{
      e.preventDefault();
      setError('');

      const url=editingId ? `http://localhost:4000/api/users/${editingId}` : 'http://localhost:4000/api/users'
      const method = editingId ? 'PUT' : 'POST';

      try{
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if(!res.ok){
          setError(data.error || 'เกิดข้อผิดพลาด')
        }

        if(editingId && data.updatedUser){
          setUsers(users.map((u)=>(u.id === editingId ? data.updatedUser : u)));
        }else if(!editingId && data.user){
          setUsers([...users, data.user]);
        }
        
        setEditingId(null);
        setForm({name: '', email: '', password: '', role: 'viewer'})
      }catch(err){
        setError('เกิดข้อผิดพลาด')
      }
    }

    const handleDeleteUser = async(id)=>{
      if(!confirm('ต้องการลบผู้ใช้นี้ใช่หรือไม่')) return;

      try{
        const res = await fetch(`http://localhost:4000/api/users/${id}`,{
          method: 'DELETE',
          credentials: 'include'
        });
        if(res.ok){
          setUsers(users.filter((u)=> u.id !== id))
        }
      }catch(err){
        alert('ลบผู้ใช้ไม่สำเร็จ')
      }
    }

    if(loading) return <div className="text-center p-10">Loading...</div>
    
    return(
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-4">รายการผู้ใช้</h1>
                <p className="text-sm text-gray-500 mb-4">Logged in as: <strong>{me?.email}</strong> {me?.role}</p>

                {me?.role === 'admin' && (
                  <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                    <h3 className="text-green-600">เพิ่มผู้ใช้</h3>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                      <input name="name" value={form.name} onChange={handleFormChange} required placeholder="ชื่อ" className="w-full sm:flex-1 border px-2 py-1 rounded" />
                      <input name="email" value={form.email} onChange={handleFormChange} required placeholder="อีเมล" className="w-full sm:flex-1 border px-2 py-1 rounded" />
                      <input name="password" value={form.password} onChange={handleFormChange} required placeholder="รหัสผ่าน" className="w-full sm:flex-1 border px-2 py-1 rounded" />
                      <select name="role" value={form.role} onChange={handleFormChange} required placeholder="รหัสผ่าน" className="w-full sm:flex-1 border px-2 py-1 rounded">
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 rounded bg-teal-600">
                        {editingId ? 'แก้ไข':'เพิ่ม' }
                      </button>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </form>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border text-sm">
                      <thead>
                          <tr>
                              <th className="border px-2 py-1 text-left">#</th>
                              <th className="border px-2 py-1 text-left">ชื่อ</th>
                              <th className="border px-2 py-1 text-left">อีเมล</th>
                              <th className="border px-2 py-1 text-left">โรล</th>
                              <th className="border px-2 py-1 text-left">สร้างเมื่อ</th>
                              <th className="border px-2 py-1 text-left text-center">จัดการ</th>
                          </tr>
                      </thead>
                      <tbody>
                          {users.filter(Boolean).map((user, i)=>(
                              <tr key={user.id} className="hover:bg-gray-50">
                                  <td className="border px-2 py-1">{i + 1}</td>
                                  <td className="border px-2 py-1">{user.name}</td>
                                  <td className="border px-2 py-1">{user.email}</td>
                                  <td className="border px-2 py-1">{user.role}</td>
                                  <td className="border px-2 py-1">{new Date(user.createdAt).toLocaleDateString()}</td>
                                  <td className="border px-2 py-1 text-center">
                                    {me?.role === 'admin' && (
                                      <div>
                                        <button onClick={()=> handleEditClick(user)} className="text-white bg-amber-500 rounded text-sm py-1 px-2 me-3"><i class="fa-solid fa-pen-to-square me-1"></i>แก้ไข</button>
                                        <button onClick={()=> handleDeleteUser(user.id)} className="text-white bg-red-500 rounded text-sm py-1 px-2 "><i className="fa-solid fa-trash me-1"></i>ลบ</button> 
                                      </div>
                                    )}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            </div>
        </div>
      </>
    )
}
