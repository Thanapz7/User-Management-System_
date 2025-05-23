const { PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs')

exports.getUers = async(req, res) => {
    const users = await prisma.user.findMany({
        select: {id: true, name: true, email: true, role: true, createdAt: true}
    });
    res.json(users);
}

exports.createUser = async(req, res) => {
    const { name, email, password, role } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {name, email, password: hashedPassword, role}
        });
        res.status(201).json(({message: 'User Created', user}))
    }catch(err){
        if(err.code === 'P2002'){
            return res.status(400).json({error: 'Email already exists'});
        }
        res.status(500).json({error: 'Failed to Create User'});
    }
}

exports.updateUser = async(req, res) => {
    const {id} = req.params;
    const { name, email, password, role} = req.body;
    try{
        const data = { name, email, role };
        if(password){
            data.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id: Number(id)},
            data
        })
        res.json({message: 'User Updated', updatedUser})
    } catch(err){
        res.status(500).json({error: 'Failed to update user'});
    }
}

exports.deleteUser = async(req, res) => {
    const {id} = req.params;
    try{
        await prisma.user.delete({ where: { id: Number(id) } });
        res.json({message: 'User deleted'});
    }catch(err){
        res.status(500).json({error: 'Failed to Delete'})
    }
}