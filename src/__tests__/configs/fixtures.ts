
import dbconnection from "../../db/config";
import { Users } from "../../models/users";
import { users } from "./users";

export const truncateAllTables = async () => {
    try {
        const queryInterface = await dbconnection.getQueryInterface();
        await queryInterface.bulkDelete('users', {});
    } catch (error) {
        console.error('Error truncating users table:', error);
    }
};


export const loadFixtures = async () => {
    await Users.bulkCreate(users)
}
