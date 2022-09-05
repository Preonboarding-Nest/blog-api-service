import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from '../commons/interfaces/response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: Response<void> = {
      status: 'error',
    };

    if (exception instanceof HttpException) {
      const httpException = exception as HttpException;

      const response: string | object = httpException.getResponse();

      responseBody.message =
        typeof response === 'string' ? response : response['message'];
    }

    if (exception instanceof Error) {
      const error = exception as Error;

      responseBody.message = error.message;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
