// import Sequelize from 'sequelize';
import database from '../models';

class UserService {
    static async getAllUsers() {
            return database.User.findAll();
    }

    static async addUser(newUser) {
            return database.User.create(newUser);
    }

    static async updateUser(id, updateUser) {
            const messageToUpdate = await database.User.findOne({
                where: { id: Number(id) }
            });

            if (messageToUpdate) {
                await database.User.update(updateUser, { where: { id: Number(id) } });

                return updateUser;
            }
            return null;
    }

    static async getAUser(id) {
            const theUser = await database.User.findOne({
                where: { id: Number(id) }
            });

            return theUser;
    }

    static async deleteUser(id) {
            const testToDelete = await database.User.findOne({ where: { id: Number(id) } });

            if (testToDelete) {
                const deletedUser = await database.User.destroy({
                    where: { id: Number(id) }
                });
                return deletedUser;
            }
            return null;
    }
}

export default UserService;
