import Sequelize from 'sequelize';
import database from '../models';

class MessageService {

    static async getPageOfMessages() {
      return database.Message.findAll(
      {
          order: [
            ['createdAt', 'DESC'],
          ],
        // order: Sequelize.col('createdAt'),
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

    // static async addMessage(newMessage) {
    //         return database.Message.create(newMessage);
    // }

    static async addMessage(newMessage) {
      const freshMessage = await database.Message.create(newMessage);
      if (freshMessage) {
        const freshMessageWithUserData = await database.Message.findOne({
          where: { id: Number(freshMessage.id) },
          include: [
            {
              model: database.User,
              as: 'userData'
            },
            {
              model: database.UploadFile,
            },
          ]
        });
        console.info('freshMessageWithUserData', freshMessageWithUserData);
        return freshMessageWithUserData;
      }

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
              where: { id: Number(id) },
              include: [
                {
                  model: database.User,
                  as: 'userData'
                },
                {
                  model: database.UploadFile,
                },
              ]
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

    static async deleteAllUserMessages(UserId) {
      const allUserMessagesDeleted = await database.Message.destroy({
        where: { UserId },
        });
      console.info('allUserMessagesDeleted', allUserMessagesDeleted);
      if (allUserMessagesDeleted) {
        await database.UploadFile.destroy({
          where: { UserId },
        });
        return true
      }
      return null;
    }

     static async deleteAllMessages() {
         const allDeleted = await database.Message.destroy({ truncate: true });
         console.info('allMessagesDeleted', allDeleted);
       // eslint-disable-next-line no-restricted-globals
         if (isNaN(allDeleted)) {
           return true
         }
         return null;
     }
}

export default MessageService;
