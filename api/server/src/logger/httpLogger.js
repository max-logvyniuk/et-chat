import morgan from 'morgan';

import winstonLogger from './winstonLogger';

winstonLogger.stream = {
  write: message => winstonLogger.info(message.slice(0, message.lastIndexOf('\n')))
};

morgan.token('body', function writeLogs(request, response, error) {
  console.info('Error', error);
  if (response.statusCode > 201) {
    return JSON.stringify(response.body)
  }
  return JSON.stringify(request.body)
});

const httpLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length] :body',
  { stream: winstonLogger.stream }
);

export default httpLogger;
