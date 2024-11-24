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

        // Fetch contacts matching email or phoneNumber
        let matchingContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    { email: email },
                    { phoneNumber: phoneNumber },
                ],
            },
        });

        // Extend to all related contacts if matches exist
        if (matchingContacts.length > 0) {
            const firstContact = matchingContacts[0];
            matchingContacts = await prisma.contact.findMany({
                where: {
                    OR: [
                        { email: firstContact.email },
                        { phoneNumber: firstContact.phoneNumber },
                    ],
                },
            });
        }

        let primaryContact = null;
        const secondaryContacts = [];

        // Fetching primary and secondary contacts
        if (matchingContacts.length > 0) {
            primaryContact = matchingContacts.find(
                (contact) => contact.linkPrecedence === "primary"
            );

            if (!primaryContact) {
                primaryContact = matchingContacts[0];
            }

            for (const contact of matchingContacts) {
                if (contact.id !== primaryContact.id) {
                    secondaryContacts.push(contact);
                }
            }
        }

        // If there is no primary contact found, then create a one.
        if (!primaryContact) {
            primaryContact = await prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkPrecedence: "primary",
                },
            });
        } else {
            // Checking if new info (email/phoneNumber) is not already linked
            const isEmailNew = email && !matchingContacts.find((contact) => contact.email === email);
            const isPhoneNumberNew = phoneNumber && !matchingContacts.find((contact) => contact.phoneNumber === phoneNumber);

            if (isEmailNew || isPhoneNumberNew) {
                const newSecondaryContact = await prisma.contact.create({
                    data: {
                        email: email || null,
                        phoneNumber: phoneNumber || null,
                        linkedId: primaryContact.id,
                        linkPrecedence: "secondary",
                    },
                });

                secondaryContacts.push(newSecondaryContact);
            }
        }

        // segregating emails,phone numbers,and secondary contact ids
        const emails = [...new Set([primaryContact, ...secondaryContacts].map(c => c.email).filter(Boolean))];
        const phoneNumbers = [...new Set([primaryContact, ...secondaryContacts].map(c => c.phoneNumber).filter(Boolean))];
        const secondaryContactIds = secondaryContacts.map((contact) => contact.id);

        res.status(200).json({
            contact: {
                primaryContactId: primaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            },
        });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
