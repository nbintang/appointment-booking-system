import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Appointment } from 'generated/prisma/client';
import { MailerService } from 'src/common/mailer/mailer.service';

@Injectable()
export class TaskAppointmentService {
  constructor(
    @InjectQueue('appointments') private readonly appointmentsQueue: Queue,
    private readonly mailerService: MailerService,
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

  async sendAppointmentReminder(obj: {
    appointmentId: string;
    userId: string;
    schedule: Date;
    userEmail: string;
  }): Promise<void> {
    await this.mailerService.sendEmail({
      subject: 'Appointment Reminder',
      to: obj.userEmail,
      text: `This is a reminder for your appointment scheduled at ${obj.schedule.toISOString()}.`,
    });
  }
}
