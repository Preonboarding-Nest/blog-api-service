import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE_ENUM } from '../users/entities/enums';
import { UsersService } from '../users/users.service';
import { Brackets, DataSource } from 'typeorm';
import {
  FindStatisticResult,
  FindStatisticsDto,
} from './dto/find-statistics.dto';
import { Statistic } from './entities/statistic.entity';
import { TERM_ENUM } from '../commons/enums/commons.enums';
import * as dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private readonly dataSource: DataSource,

    private readonly usersSerive: UsersService,
  ) {}

  async find(
    findStatisticsDto: FindStatisticsDto,
  ): Promise<FindStatisticResult[]> {
    const {
      from,
      to,
      resource,
      method,
      gender,
      ageFrom,
      ageTo,
      userRole: role,
      term = TERM_ENUM.DATE,
      termUnit = '1',
      currentUserId,
    } = findStatisticsDto;

    const nowDay = dayjs();
    const fromDay = dayjs(from);
    const toDay = dayjs(to);

    if (nowDay.format() < toDay.format()) {
      throw new BadRequestException("'to' 날짜는 오늘 이전 이어야 합니다.");
    }

    const termUnitValidatior = {
      month: [1, 2, 3, 4, 5, 6],
      date: [1, 7, 14],
      hour: [1, 2, 3, 4, 6, 8, 12],
      min: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30],
    };

    if (!termUnitValidatior[term].includes(Number(termUnit))) {
      throw new BadRequestException(
        "'termUnit' 값은 'term' 값에 따라 맞는 값이어야 합니다.",
      );
    }

    if ((ageFrom && !ageTo) || (!ageFrom && ageTo)) {
      throw new BadRequestException(
        "'ageFrom' 또는 'ageTo'값은 같이 사용됩니다.",
      );
    }

    const user = await this.usersSerive.findUserById(currentUserId);

    if (user.role !== ROLE_ENUM.ADMIN) {
      throw new ForbiddenException(
        '해당 권한으로는 통계 조회를 할 수 없습니다.',
      );
    }

    const baseQuery = this.dataSource
      .getRepository(Statistic)
      .createQueryBuilder('statistic')
      .innerJoin('statistic.user', 'user')
      .where(
        new Brackets((qb) => {
          qb.where('statistic.year >= :fromYear', {
            fromYear: fromDay.get('year'),
          })
            .andWhere('statistic.month >= :fromMonth', {
              fromMonth: fromDay.get('month') + 1,
            })
            .andWhere('statistic.date >= :fromDate', {
              fromDate: fromDay.get('date'),
            });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('statistic.year <= :toYear', {
            toYear: toDay.get('year'),
          })
            .andWhere('statistic.month <= :toMonth', {
              toMonth: toDay.get('month') + 1,
            })
            .andWhere('statistic.date <= :toDate', {
              toDate: toDay.get('date'),
            });
        }),
      );

    if (resource) {
      baseQuery.andWhere('statistic.resource = :resource', { resource });
    }

    if (method) {
      baseQuery.andWhere('statistic.method = :method', { method });
    }

    if (gender) {
      baseQuery.andWhere('user.gender = :gender', { gender });
    }

    if (ageFrom && ageTo) {
      baseQuery.andWhere(
        new Brackets((qb) => {
          qb.where('user.age >= :ageFrom', {
            ageFrom: Number(ageFrom),
          }).andWhere('user.age <= :ageTo', {
            ageTo: Number(ageTo) + 9,
          });
        }),
      );
    }

    if (role) {
      baseQuery.andWhere('user.role = :role', { role });
    }

    baseQuery.orderBy('statistic.id');

    const statistics = await baseQuery.getMany();

    const secDiffrenceBetweenDates = toDay.unix() - fromDay.unix();

    let timeUnit = Number(termUnit);

    if (term === TERM_ENUM.MIN) {
      timeUnit = timeUnit * 60;
    } else if (term === TERM_ENUM.HOUR) {
      timeUnit = timeUnit * 60 * 60;
    } else if (term === TERM_ENUM.DATE) {
      timeUnit = timeUnit * 60 * 60 * 24;
    } else if (term === TERM_ENUM.MONTH) {
      timeUnit = timeUnit * 60 * 60 * 24 * 30;
    }

    const result: FindStatisticResult[] = [];
    let statisticIndex = 0;
    const baseTime = fromDay.unix();

    for (let i = 0; i < secDiffrenceBetweenDates; i += timeUnit) {
      const timeTerm = [i, i + timeUnit];

      const startTimestamp = baseTime + timeTerm[0];
      const endTimestamp = baseTime + timeTerm[1];

      let count = 0;

      while (statisticIndex < statistics.length) {
        const { year, month, date, hour, min, sec } =
          statistics[statisticIndex];

        const statisticTimestamp = dayjs(
          `${year}-${month}-${date} ${hour}:${min}:${sec}`,
        ).unix();

        if (statisticTimestamp >= endTimestamp) {
          break;
        }

        if (
          startTimestamp <= statisticTimestamp &&
          statisticTimestamp < endTimestamp
        ) {
          count++;
          statisticIndex++;
        }
      }

      const startTime = dayjs(startTimestamp * 1000)
        .format()
        .toString();

      const endTime = dayjs(endTimestamp * 1000)
        .format()
        .toString();

      result.push({
        startTime,
        endTime,
        count,
      });
    }

    return result;
  }
}
