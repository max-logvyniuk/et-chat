import Sequelize from 'sequelize';
import database from '../models';
// import UploadFileService from "./UploadFileService";
// const UploadFile = database.UploadFile;

class MessageService {
    static async getAllMessages() {
            return database.Message.findAll(
              {
              order: Sequelize.col('createdAt'),
              include: [
                {
                  model: database.User,
                  as: 'userData'
                },
                {
                  model: database.UploadFile,
                },
              ]
              }
            );
    }

    static async addMessage(newMessage) {
            return database.Message.create(newMessage);
    }

    static async updateMessage(id, updateMessage) {
            const messageToUpdate = await database.Message.findOne({
                where: { id: Number(id) }
            });

            if (messageToUpdate) {
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
