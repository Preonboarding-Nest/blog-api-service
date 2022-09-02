import { HTTP_METHOD_ENUM } from 'src/commons/enums/commons.enums';

export class StatisticsSaveEvent {
  path: string;
  method: HTTP_METHOD_ENUM;

  constructor(path: string, method: HTTP_METHOD_ENUM) {
    this.path = path;
    this.method = method;
  }
}
