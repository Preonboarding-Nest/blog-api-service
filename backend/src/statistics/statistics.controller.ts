import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GENDER_ENUM, ROLE_ENUM } from '../users/entities/enums';
import { GetCurrentUserId } from '../commons/decorators';
import { StatisticsService } from './statistics.service';
import { TERM_ENUM } from '../commons/enums/commons.enums';
import { FindStatisticResults } from './dto/find-statistics.dto';

@ApiTags('Statistics API')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({
    summary: '통계 조회 API',
    description: '통계 정보를 조회합니다.',
  })
  @ApiOkResponse({
    status: 200,
    description: '통계 정보를 조회합니다.',
    type: FindStatisticResults,
  })
  @ApiQuery({
    name: 'from',
    description: '조회 시작 날짜를 나타냅니다. (yyyy-mm-dd)',
  })
  @ApiQuery({
    name: 'to',
    description: '조회 끝 날짜를 나타냅니다. (yyyy-mm-dd)',
  })
  @ApiQuery({
    name: 'resource',
    required: false,
    description: '조회하고자 하는 자원을 나타냅니다.',
  })
  @ApiQuery({
    name: 'method',
    required: false,
    description: '조회하고자 하는 행위를 나타냅니다.',
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    description: '조회하고자 하는 성별을 나타냅니다.',
  })
  @ApiQuery({
    name: 'age_from',
    required: false,
    description:
      '조회하고자 하는 나이대(시작)을 나타냅니다.(10, 20, 30, ..., 60)',
  })
  @ApiQuery({
    name: 'age_to',
    required: false,
    description:
      '조회하고자 하는 나이대(끝)을 나타냅니다.(10, 20, 30, ..., 60)',
  })
  @ApiQuery({
    name: 'user_role',
    required: false,
    description: '조회하고자 하는 사용자 권한을 나타냅니다.',
  })
  @ApiQuery({
    name: 'term',
    enum: TERM_ENUM,
    enumName: 'TERM',
    required: false,
    description: '조회하고자 통계 시간 단위을 나타냅니다.(월, 일, 시간, 분)',
  })
  @ApiQuery({
    name: 'term_unit',
    required: false,
    description:
      '조회하고자 통계 시간 단위 값을 나타냅니다. term에 따라 사용 가능한 값이 다릅니다. (월(1,2,3,4,6) / 일(1,7,14) / 시간(1,2,3,4,6,8,12) / 분(1,2,3,4,5,6,10,12,15,20,30)',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('accessToken')
  @Get()
  async find(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('resource') resource: string,
    @Query('method') method: string,
    @Query('gender') gender: GENDER_ENUM,
    @Query('age_from') ageFrom: string,
    @Query('age_to') ageTo: string,
    @Query('user_role') userRole: ROLE_ENUM,
    @Query('term') term: TERM_ENUM,
    @Query('term_unit') termUnit: string,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<FindStatisticResults> {
    const results = await this.statisticsService.find({
      from,
      to,
      resource,
      method,
      gender,
      ageFrom,
      ageTo,
      userRole,
      term,
      termUnit,
      currentUserId,
    });

    return {
      results,
    };
  }
}
