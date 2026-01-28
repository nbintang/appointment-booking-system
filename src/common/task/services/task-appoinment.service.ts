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
    await this.appointmentsQueue.add('sendReminder', {
      appointmentId: appointment.id,
      userId: appointment.userId,
      schedule: appointment.schedule,
    });
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
