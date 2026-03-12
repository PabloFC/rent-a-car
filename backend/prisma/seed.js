import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@rentacar.com";

  const existe = await prisma.usuario.findUnique({ where: { email } });

  if (existe) {
    console.log("⚠️  El usuario admin ya existe:", email);
    return;
  }

  const passwordHash = await bcrypt.hash("admin1234", 10);

  const admin = await prisma.usuario.create({
    data: {
      nombre: "Administrador",
      email,
      password: passwordHash,
      rol: "ADMIN",
    },
  });

  console.log("✅ Admin creado:");
  console.log("   Email:      ", admin.email);
  console.log("   Contraseña:  admin1234");
  console.log("   Rol:        ", admin.rol);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
