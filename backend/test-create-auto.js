import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.auto.create({
      data: {
        marca: "Test",
        modelo: "Vehicle",
        anio: 2026,
        precioPorDia: 50,
        descripcion: "Testing",
        categoria: "SUV",
      },
    });
    console.log("✅ Auto creado:", result);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
