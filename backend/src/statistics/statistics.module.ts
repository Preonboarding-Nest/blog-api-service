import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { StatisticsListener } from './listeners/statistics-save.listener';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistic } from './entities/statistic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic])],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsListener],
})
export class StatisticsModule {}
