import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GENDER_ENUM, ROLE_ENUM } from '../users/entities/enums';
import { GetCurrentUserId } from '../commons/decorators';
import { StatisticsService } from './statistics.service';
import { TERM_ENUM } from '../commons/enums/commons.enums';

@ApiTags('Statistics API')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({
    summary: '통계 조회 API',
    description: '통계 정보를 조회합니다.',
  })
  @ApiCreatedResponse({ description: '통계 정보를 조회합니다.' })
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
    name: 'term_unit',
    required: false,
    description: '조회하고자 통계 시간 단위 값을 나타냅니다.',
  })
  @ApiQuery({
    name: 'term',
    required: false,
    description:
      '조회하고자 통계 시간 단위을 나타냅니다.(년, 월, 일, 시간, 분, 초)',
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
    @Query('term_unit') termUnit: string,
    @Query('term') term: TERM_ENUM,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return await this.statisticsService.find({
      from,
      to,
      resource,
      method,
      gender,
      ageFrom,
      ageTo,
      userRole,
      termUnit,
      term,
      currentUserId,
    });
  }
}
