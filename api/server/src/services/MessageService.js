import database from '../models';

class MessageService {
    static async getAllMessages() {
            return database.Message.findAll();
    }

    static async addMessage(newMessage) {
            return database.Message.create(newMessage);
    }

    static async updateMessage(id, updateMessage) {
            const testToUpdate = await database.Message.findOne({
                where: { id: Number(id) }
            });

            if (testToUpdate) {
                await database.Message.update(updateMessage, { where: { id: Number(id) } });

                return updateMessage;
            }
            return null;
    }

    static async getAMessage(id) {
            const theMessage = await database.Message.findOne({
                where: { id: Number(id) }
            });

            return theMessage;
    }

    static async deleteMessage(id) {
            const testToDelete = await database.Message.findOne({ where: { id: Number(id) } });

            if (testToDelete) {
                const deletedMessage = await database.Message.destroy({
                    where: { id: Number(id) }
                });
                return deletedMessage;
            }
            return null;
    }
}

export default MessageService;
