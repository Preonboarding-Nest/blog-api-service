import { TERM_ENUM } from 'src/commons/enums/commons.enums';
import { GENDER_ENUM, ROLE_ENUM } from 'src/users/entities/enums';

export class FindStatisticsDto {
  from: string;
  to: string;
  resource: string;
  method: string;
  gender: GENDER_ENUM;
  ageFrom: string;
  ageTo: string;
  userRole: ROLE_ENUM;
  term: TERM_ENUM;
  termUnit: string;
  currentUserId: number;
}

export class FindStatisticResult {
  startTime: string;
  endTime: string;
  count: number;
}

export class FindStatisticResults {
  results: FindStatisticResult[];
}
