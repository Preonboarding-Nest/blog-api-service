import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { StatisticsListener } from './listeners/statistics-save.listener';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistic } from './entities/statistic.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic]), UsersModule],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsListener],
})
export class StatisticsModule {}
