import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { TaskAppointmentService } from '../services/task-appoinment.service';

@Processor('appointments')
@Injectable()
export class TaskAppointmentProcessor {
  constructor(
    private readonly logger: Logger,
    private readonly taskAppointmentService: TaskAppointmentService,
  ) {}

  @Process('sendReminder')
  async sendReminder(job: Job) {
    this.logger.log(`Mengirim pengingat untuk janji temu ${job.id}`);
    const { appointmentId, userId, schedule } = job.data;
    await this.taskAppointmentService.sendAppointmentReminder(
      appointmentId,
      userId,
      schedule,
    );
  }
}
