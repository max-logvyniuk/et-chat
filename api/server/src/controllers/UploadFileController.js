import UploadFileService from '../services/UploadFileService';
import Util from '../utils/Utils';
// import sendEmailUploadFile from '../mailer/subscriber';
import cloudinary from '../core/cloudinary';

const util = new Util();

class UploadFileController {

    static async addUploadFile(request, response) {
        // const io = request.app.get('socketio');
      // console.info('Vooooooooo!!!', request);
        // console.info('Vooooooooo!!!', request.file, request.headers);
        const UserId = request.headers.userid;
        const file = request.file;
        try {
          cloudinary.v2.uploader
            .upload_stream({ resource_type: "auto" }, async (error, result) => {
              if (error) {
                console.info('ERRRR1', error);
                throw new Error(error);
              }

              const fileData = {
                filename: result.original_filename,
                size: result.bytes,
                ext: result.format,
                url: result.url,
                UserId,
              };

              // console.info('fileData', fileData);
              const uploadFile = await UploadFileService.addUploadFile(fileData);
              util.setSuccess(201, 'Message Added!', uploadFile);

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
      // console.info('Delete IO', io.emit('SERVER:REMOVE_MESSAGE', id));
      // io.emit('SERVER:REMOVE_MESSAGE', id);
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }

}


export default UploadFileController;
