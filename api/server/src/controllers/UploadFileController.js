import UploadFileService from '../services/UploadFileService';
import Util from '../utils/Utils';
// import sendEmailUploadFile from '../mailer/subscriber';
import cloudinary from '../core/cloudinary';

const util = new Util();

class UploadFileController {

    static async addUploadFile(request, response) {
        // const io = request.app.get('socketio');
        // console.info('UploadFile header!!!', request.file, request.headers);
        const UserId = request.headers.userid;
        const file = request.file;
        try {
          cloudinary.v2.uploader
            .upload_stream({ resource_type: "auto" },
              async (error, result) => {

              console.info('cloudinary result', result);
              if (error) {
                console.info('ERROR1', error);
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

              // console.info('fileData', fileData);
              const uploadFile = await UploadFileService.addUploadFile(fileData);
              util.setSuccess(201, 'File uploaded!', uploadFile);

              return util.send(response);

            })
            .end(file.buffer);

        } catch (error) {
          console.info('ERRRRR AudioFile', error);
            util.setError(400, error.message);
            return util.send(response);
        }
    };

  static async deleteUploadFile(request, response) {
    // const io = request.app.get('socketio');
    const { id } = request.params;
    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(response);
    }

    try {
      const uploadFileToDelete = await UploadFileService.deleteUploadFile(id);

      // io.emit('SERVER:REMOVE_MESSAGE', id);
      if (uploadFileToDelete) {
        util.setSuccess(200, 'UploadFile deleted');
      } else {
        util.setError(404, `UploadFile with the id ${id} cannot be found`);
      }
      return util.send(response);
    } catch (error) {
      console.info('Delete file error', error);
      util.setError(400, error);
      return util.send(response);
    }
  }

}


export default UploadFileController;
