import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
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
    @Query('user_role') user_role: ROLE_ENUM,
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
      user_role,
      term,
      currentUserId,
    });
  }
}
