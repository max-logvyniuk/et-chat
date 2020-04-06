import database from '../models';


class UploadFileService {

    static async addUploadFile(newUploadFile) {
            return database.UploadFile.create(newUploadFile);
    }

    static async updateUploadFile(id, updateUploadFile) {
      const uploadFileToUpdate = await database.UploadFile.findOne({
        where: { id: Number(id) }
      });

      if (uploadFileToUpdate) {
        await database.UploadFile.update(updateUploadFile, { where: { id: Number(id) } });

        return updateUploadFile;
     }
     return null;
  }

    static async deleteUploadFile(id) {
            const fileToDelete = await database.UploadFile.findOne({ where: { id: Number(id) } });

            if (fileToDelete) {
                const deletedUploadFile = await database.UploadFile.destroy({
                    where: { id: Number(id) }
                });
                return deletedUploadFile;
            }
            return null;
    }
}

export default UploadFileService;
