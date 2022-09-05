import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE_ENUM } from '../users/entities/enums';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { FindStatisticsDto } from './dto/find-statistics.dto';
import { Statistic } from './entities/statistic.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private readonly statisticsRepository: Repository<Statistic>,
    private readonly usersSerive: UsersService,
  ) {}

  async find(FindStatisticsDto: FindStatisticsDto) {
    const {
      from,
      to,
      resource,
      method,
      gender,
      ageFrom,
      ageTo,
      user_role,
      term,
      currentUserId,
    } = FindStatisticsDto;

    // 시작시간
    // 종료시간
    // 년 월 일 시 분 초

    const user = await this.usersSerive.findUserById(currentUserId);
    if (user.role !== ROLE_ENUM.ADMIN) {
      throw new ForbiddenException(
        'Cannot find statistic with that permission',
      );
    }

    return await `This action returns all statistics`;
  }
}
