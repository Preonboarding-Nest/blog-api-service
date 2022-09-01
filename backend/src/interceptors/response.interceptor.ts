import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from '../commons/interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data.message) {
          return {
            status: 'success',
            data,
          };
        }

        return data;
      }),
    );
  }
}
