const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const permissions = ['create_user', 'edit_user', 'delete_user', 'view_user'];
  const permissionRecords = await Promise.all(
    permissions.map(name =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      permissions: {
        create: permissionRecords.map(p => ({
          permission: { connect: { id: p.id } }
        }))
      }
    }
  });

  await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      permissions: {
        create: [
          {
            permission: {
              connect: { name: 'view_user' }
            }
          }
        ]
      }
    }
  });

  console.log('Roles and permissions seeded.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
