import database from '../models';

class MessageService {
    static async getAllMessages() {
        try {
            return await database.Message.findAll();
        } catch (error) {
            throw error;
        }
    }

    static async addMessage(newMessage) {
        try {
            return await database.Message.create(newMessage);
        } catch (error) {
            throw error;
        }
    }

    static async updateMessage(id, updateMessage) {
        try {
            const testToUpdate = await database.Message.findOne({
                where: { id: Number(id) }
            });

            if (testToUpdate) {
                await database.Message.update(updateMessage, { where: { id: Number(id) } });

                return updateMessage;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async getAMessage(id) {
        try {
            const theMessage = await database.Message.findOne({
                where: { id: Number(id) }
            });

            return theMessage;
        } catch (error) {
            throw error;
        }
    }

    static async deleteMessage(id) {
        try {
            const testToDelete = await database.Message.findOne({ where: { id: Number(id) } });

            if (testToDelete) {
                const deletedMessage = await database.Message.destroy({
                    where: { id: Number(id) }
                });
                return deletedMessage;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageService;