import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const AUTOS_DEMO = [
  // Economicos
  {
    marca: "Toyota",
    modelo: "Yaris",
    anio: 2024,
    precioPorDia: 25,
    descripcion: "Ideal para ciudad y trayectos cortos",
    disponible: true,
  },
  {
    marca: "Volkswagen",
    modelo: "Polo",
    anio: 2024,
    precioPorDia: 28,
    descripcion: "Compacto y eficiente",
    disponible: true,
  },
  {
    marca: "Renault",
    modelo: "Clio",
    anio: 2023,
    precioPorDia: 27,
    descripcion: "Confort urbano",
    disponible: true,
  },
  // SUV
  {
    marca: "Toyota",
    modelo: "RAV4",
    anio: 2024,
    precioPorDia: 65,
    descripcion: "Espaciosa para viajes familiares",
    disponible: true,
  },
  {
    marca: "Volkswagen",
    modelo: "Tiguan",
    anio: 2024,
    precioPorDia: 72,
    descripcion: "SUV premium de uso mixto",
    disponible: true,
  },
  {
    marca: "Hyundai",
    modelo: "Tucson",
    anio: 2024,
    precioPorDia: 68,
    descripcion: "Comoda y segura",
    disponible: true,
  },
  // Premium
  {
    marca: "BMW",
    modelo: "Serie 5",
    anio: 2024,
    precioPorDia: 125,
    descripcion: "Lujo y alto rendimiento",
    disponible: true,
  },
  {
    marca: "Mercedes",
    modelo: "Clase E",
    anio: 2024,
    precioPorDia: 135,
    descripcion: "Confort ejecutivo",
    disponible: true,
  },
  {
    marca: "Audi",
    modelo: "A6",
    anio: 2024,
    precioPorDia: 130,
    descripcion: "Tecnologia y dinamica premium",
    disponible: true,
  },
];

async function main() {
  const email = "admin@rentacar.com";

  const existe = await prisma.usuario.findUnique({ where: { email } });

  if (!existe) {
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
  } else {
    console.log("⚠️  El usuario admin ya existe:", email);
  }

  const totalAutos = await prisma.auto.count();
  if (totalAutos === 0) {
    await prisma.auto.createMany({ data: AUTOS_DEMO });
    console.log(`✅ Se cargaron ${AUTOS_DEMO.length} autos demo.`);
  } else {
    console.log(`⚠️  Ya existen ${totalAutos} autos. No se cargaron autos demo.`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
