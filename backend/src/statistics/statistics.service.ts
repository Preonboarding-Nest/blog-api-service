import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE_ENUM } from '../users/entities/enums';
import { UsersService } from '../users/users.service';
import { Between, Repository } from 'typeorm';
import { FindStatisticsDto } from './dto/find-statistics.dto';
import { Statistic } from './entities/statistic.entity';
import { TERM_ENUM } from '../commons/enums/commons.enums';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private readonly statisticsRepository: Repository<Statistic>,

    private readonly usersSerive: UsersService,
  ) {}

  async find(findStatisticsDto: FindStatisticsDto) {
    const {
      from,
      to,
      resource,
      method,
      gender,
      ageFrom,
      ageTo,
      userRole: role,
      termUnit = '1',
      term = TERM_ENUM.DATE,
      currentUserId,
    } = findStatisticsDto;

    const [fromYear, fromMonth, fromDate] = from
      .split('-')
      .map((data) => Number(data));

    const [toYear, toMonth, toDate] = to.split('-').map((data) => Number(data));

    const nowTimestamp = new Date().getTime();
    const toTimestamp = new Date(toYear, toMonth, toDate).getTime();

    if (nowTimestamp < toTimestamp) {
      throw new BadRequestException("'to' should be a date less than today");
    }

    const user = await this.usersSerive.findUserById(currentUserId);

    if (user.role !== ROLE_ENUM.ADMIN) {
      throw new ForbiddenException(
        'Cannot find statistic with that permission',
      );
    }

    const statistics = await this.statisticsRepository.find({
      where: {
        user: {
          gender,
          age:
            ageFrom && ageTo
              ? Between(Number(ageFrom), Number(ageTo) + 9)
              : undefined,
          role,
        },
        year: Between(fromYear, toYear),
        month: Between(fromMonth, toMonth),
        date: Between(fromDate, toDate),
        resource,
        method,
      },
      order: {
        id: 'ASC',
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          gender: true,
          age: true,
          role: true,
        },
      },
    });

    return statistics;
  }
}
