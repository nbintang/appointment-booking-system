import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Appointment } from 'generated/prisma/client';

@Injectable()
export class TaskAppointmentService {
  constructor(
    @InjectQueue('appointments') private readonly appointmentsQueue: Queue,
  ) {}

  async addReminderQueue(appointment: Appointment): Promise<void> {
    const remindBeforeMinutes = 60;
    const remindAtMs =
      new Date(appointment.schedule).getTime() - remindBeforeMinutes * 60_000;
    const delayMs = Math.max(0, remindAtMs - Date.now());
    await this.appointmentsQueue.add(
      'sendReminder',
      {
        appointmentId: appointment.id,
        userId: appointment.userId,
        schedule: appointment.schedule,
      },
      {
        delay: delayMs,
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );
  }

  async sendAppointmentReminder(
    appointmentId: string,
    userId: string,
    schedule: Date,
  ): Promise<void> {
    console.log('Sending appointment reminder', {
      appointmentId,
      userId,
      schedule,
    });
  }
}
