import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export async function connectDB() {
    try{
        await prisma.$connect();
        console.log("DB connected successfully.")
    }
    catch(e){
        console.error("DB Connection Error "+ e);
    }

}


