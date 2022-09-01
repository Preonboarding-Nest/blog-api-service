import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EVENTS } from '../../commons/constants';
import { Statistic } from '../entities/statistic.entity';
import { StatisticsSaveEvent } from '../events/statistics-save.event';

@Injectable()
export class StatisticsListener {
  constructor(
    @InjectRepository(Statistic)
    private readonly statisticsRepository: Repository<Statistic>,
  ) {}

  @OnEvent(EVENTS.STATISTICS_SAVE, { async: true })
  async handleStatisticsSaveEvent(event: StatisticsSaveEvent): Promise<void> {
    const { path, method } = event;

    await this.statisticsRepository.save(
      this.statisticsRepository.create({
        path,
        method,
      }),
    );
  }
}
