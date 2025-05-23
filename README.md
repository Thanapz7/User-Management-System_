# ระบบจัดการผู้ใช้งาน (User Management System)

โปรเจกต์ Fullstack สำหรับจัดการข้อมูลผู้ใช้งาน ที่รองรับการล็อกอิน การลงทะเบียน การจำกัดสิทธิ์ของผู้ใช้งาน (admin/viewer) และการจัดการข้อมูล เช่น เพิ่ม ลบ แก้ไข รวมถึงกำหนดบทบาท (role) ของผู้ใช้งาน

## 🔧 เทคโนโลยีที่ใช้

- **Frontend**: Next.js, TailwindCSS
- **Backend**: Express.js, Prisma, SQL
- **Authentication**: Session (Cookie-based)
- **Database**: Prisma ORM + SQL (สำหรับพัฒนา)

## ⚙️ วิธีติดตั้งและรันโปรเจกต์

### 1. ติดตั้ง dependencies

```bash
cd backend
npm install

cd ../frontend
npm install

2.ตั้งค่าฐานข้อมูล Prisma (ครั้งแรกเท่านั้น)
cd backend
npx prisma generate
npx prisma migrate dev --name init

3. รันโปรเจกต์ (Dev Mode)
รัน backend
cd backend
npm run dev

รัน frontend
cd ../frontend
npm run dev


เปิดเบราว์เซอร์ที่ http://localhost:3000

