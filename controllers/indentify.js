import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const identify = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({
                error: "At least one of email or phoneNumber must be provided.",
            });
        }

        // Step 1: Find all matching contacts
        let matchingContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    { email: email || undefined },
                    { phoneNumber: phoneNumber || undefined },
                ],
            },
        });
        if (matchingContacts.length > 0){
            matchingContacts = await prisma.contact.findMany({
                where: {
                    OR: [
                        { email: matchingContacts[0].email },
                        { phoneNumber: matchingContacts[0].phoneNumber },
                    ],
                },
            });
        }


        let primaryContact = null;
        const secondaryContacts = [];

        // Step 2: Determine the primary contact
        if (matchingContacts.length > 0) {
            // Find the primary contact (oldest with linkPrecedence = 'primary')
            primaryContact = matchingContacts.find(
                (contact) => contact.linkPrecedence === "primary"
            );

            if (!primaryContact) {
                primaryContact = matchingContacts[0];
            }



            matchingContacts.forEach((contact) => {
                if (contact.id !== primaryContact.id) {
                    secondaryContacts.push(contact);
                }
            });
        }

        // Step 3: If no matching contact is found, create a new primary contact
        if (!primaryContact) {
            primaryContact = await prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkPrecedence: "primary",
                },
            });
        } else {
            // Step 4: Check if the request contains new info that warrants creating a secondary contact
            const isNewInfo =
                (email && !matchingContacts.some((contact) => contact.email === email)) ||
                (phoneNumber &&
                    !matchingContacts.some((contact) => contact.phoneNumber === phoneNumber));

            if (isNewInfo) {
                const newSecondaryContact = await prisma.contact.create({
                    data: {
                        email,
                        phoneNumber,
                        linkedId: primaryContact.id,
                        linkPrecedence: "secondary",
                    },
                });

                secondaryContacts.push(newSecondaryContact);
            }
        }

        // Step 5: Consolidate the response data
        const allContacts = [primaryContact, ...secondaryContacts];
        const emails = Array.from(
            new Set(allContacts.map((contact) => contact.email).filter(Boolean))
        );
        const phoneNumbers = Array.from(
            new Set(allContacts.map((contact) => contact.phoneNumber).filter(Boolean))
        );
        const secondaryContactIds = secondaryContacts.map((contact) => contact.id);

        // Step 6: Return the response
        res.status(200).json({
            contact: {
                primaryContatctId: primaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            },
        });
    } catch (error) {
        console.error("Error in /identify:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
