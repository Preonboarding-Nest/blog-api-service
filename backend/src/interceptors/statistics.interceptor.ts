import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { HTTP_METHOD_ENUM } from '../commons/enums/commons.enums';
import { StatisticsSaveEvent } from '../statistics/events/statistics-save.event';
import { EVENTS, PREFIX } from '../commons/constants';

@Injectable()
export class StatisticsInterceptor implements NestInterceptor {
  constructor(private eventEmitter: EventEmitter2) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();

    const req = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        // Exception이 아니라면, statistics.save event 발생 후, return
        // Exception시, name key값이 있으며, 'HttpException' 등의 value 값을 가짐
        const url = req.url.substring(`${PREFIX}/`.length, req.url.length);
        console.log(url);

        if (data.name === undefined) {
          this.eventEmitter.emit(
            EVENTS.STATISTICS_SAVE,
            new StatisticsSaveEvent(req.url, HTTP_METHOD_ENUM[req.method]),
          );
        }

        return data;
      }),
    );
  }
}

// 분단위 시단위 일단위 주단위 월단위

// 통계 시작 시간

// 통계 끝 시간 (default = new Date() now)
