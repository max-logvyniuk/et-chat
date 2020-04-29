import UploadFileService from '../services/UploadFileService';
import Util from '../utils/Utils';
import cloudinary from '../core/cloudinary';

const util = new Util();

class UploadFileController {
  static async addUploadFile(request, response) {
    const UserId = request.headers.userid;
    const file = request.file;
    try {
      cloudinary.v2.uploader
        .upload_stream({ resource_type: "auto" },
          async (error, result) => {
          if (error) {
            throw new Error(error);
          }
          const fileData = {
            ext: result.format,
            filename: result.original_filename,
            publicId: result.public_id,
            size: result.bytes,
            url: result.url,
            UserId,
          };
          const uploadFile = await UploadFileService.addUploadFile(fileData);
          util.setSuccess(201, 'File uploaded!', uploadFile);

          return util.send(response);
        })
        .end(file.buffer);

    } catch (error) {
      util.setError(500, error.message);
      return util.send(response);
    }
  };

  static async updateUploadFile(id, newMessageId) {
    try {
      const updatedUploadFile = await UploadFileService.updateUploadFile(id, newMessageId);
      if (updatedUploadFile) {
        return true
      }
      return null
    } catch (error) {
      return console.error('UploadFile not updated', error);
    }
  };

  static async deleteUploadFile(request, response) {
    const { id } = request.params;
    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(response);
    }

    try {
      const uploadFileToDelete = await UploadFileService.deleteUploadFile(id);
      if (uploadFileToDelete) {
        util.setSuccess(200, 'UploadFile deleted');
      } else {
        util.setError(404, `UploadFile with the id ${id} cannot be found`);
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async deleteAllUploadFiles() {
    try {
      const deleteSuccess = await UploadFileService.deleteAllFiles();
      if (deleteSuccess) {
        return true
      }
      return null;
    } catch (error) {
      console.error(error)
    }
  }

}

export default UploadFileController;
