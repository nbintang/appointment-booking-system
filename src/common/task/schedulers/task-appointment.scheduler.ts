import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TaskAppointmentService } from '../services/task-appoinment.service';

@Injectable()
export class TaskAppoinmentScheduler {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
    private readonly taskAppointmentService: TaskAppointmentService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendAppointmentReminder(): Promise<void> {
    const upcomingAppointments = await this.prisma.appointment.findMany({
      where: {
        schedule: {
          gt: new Date(),
          lt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        },
      },
    });
    for (const appointment of upcomingAppointments) {
      await this.taskAppointmentService.addReminderQueue(appointment);
    }
    this.logger.log('Appointment reminders sent');
  }
}
