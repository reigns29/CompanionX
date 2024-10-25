const { PrismaClient } = require("@prisma/client");
// import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Famous People" },
        { name: "Movies & TV" },
        { name: "Musicians" },
        { name: "Games" },
        { name: "Animals" },
        { name: "Philosophy" },
        { name: "Scientists" }
      ]
    });
  } catch (error) {
    console.error("Error Seeding Default Categories: ", error);
  }

  try{
    await db.tag.createMany({
      data: [
        { name: "Entreprenuer" },
        { name: "Leader" },
        { name: "Musician" },
        { name: "Sports" },
        { name: "Poet" },
        { name: "Philosophy" },
        { name: "Scientist" },
        { name: "Actor"}
      ]
    });
  }catch(error){
    console.error("Error seeding default tags: ", error);
  }

  try{
    await db.user.create({
      data:{
        userEmail: "your-email-here",
        role: "super"
      }
    });
  }catch(error){
    console.error("Error seeding super user for admin site: ", error);
  }
}

main();
