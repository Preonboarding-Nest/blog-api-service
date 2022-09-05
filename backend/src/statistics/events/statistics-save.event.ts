export class StatisticsSaveEvent {
  resource: string;
  method: string;
  userId: number;

  constructor(resource: string, method: string, userId: number = undefined) {
    this.resource = resource;
    this.method = method;
    this.userId = userId;
  }
}
