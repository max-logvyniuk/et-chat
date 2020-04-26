import database from '../models';
import cloudinary from '../core/cloudinary';


class UploadFileService {

    static async addUploadFile(newUploadFile) {
            return database.UploadFile.create(newUploadFile);
    }

    static async updateUploadFile(id, newMessageId) {
      const uploadFileToUpdate = await database.UploadFile.findOne({
        where: { id: Number(id) }
      });

      if (uploadFileToUpdate) {
        await database.UploadFile.update(
          {MessageId: newMessageId},
          {where: { id: Number(id)}
          });

        return true;
     }
     return null;
  }

    static async deleteUploadFile(id) {
            console.info('In service', id);
            const fileToDelete = await database.UploadFile.findOne({ where: { id: Number(id) } });
            console.info('Voice message that will dell from cloudinary', fileToDelete);
            const cloudinaryId = fileToDelete.publicId;
            // toString(cloudinaryId);
            console.info('Id cloudinaryId', cloudinaryId);
            await cloudinary.v2.api.delete_resources([`${cloudinaryId}`],
             { type: 'upload' },
             function(error, result) {
              console.info('Result from cloudinary', result, error);
            });

            if (fileToDelete) {
                const deletedUploadFile = await database.UploadFile.destroy({
                    where: { id: Number(id) }
                });
                return deletedUploadFile;
            }
            return null;
    }

    static async deleteAllFiles() {
      // Do deleting all file from cloudinary
      const allFileDeleted = await database.UploadFile.destroy({ truncate: true });
      console.info('UploadFile', allFileDeleted);
      return allFileDeleted;
    }
}

export default UploadFileService;
