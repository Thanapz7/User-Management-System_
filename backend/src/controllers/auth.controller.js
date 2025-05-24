const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'viewer'
        }
        });
    res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error('Register Error:', err);
        if (err.code === 'P2002') {
        return res.status(400).json({ error: 'Email is already in use' });
    }
    res.status(500).json({ error: 'Registration failed' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await prisma.user.findUnique({where: {email}});
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({error: 'Invalid Email or Password'});
        }
        req.session.user = { id: user.id, role: user.role};
        res.json({message: 'Login Seccessful'})
    }catch(err){
        res.status(500).json({error: 'Login failed'})
    }
}

exports.getMe = async (req, res) =>{
    if(!req.session.user) return res.status(401).json({message: 'Not Authenticated'})
    const user = await prisma.user.findUnique({
        where: {id: req.session.user.id},
        select: {id: true, name: true, email: true, role: true}
    });
    res.json(user);
}

exports.logout = (req, res) => {
    req.session.destroy(()=>{
        res.clearCookie('connect.sid');
        res.json({message: 'Logged out'})
    });
}