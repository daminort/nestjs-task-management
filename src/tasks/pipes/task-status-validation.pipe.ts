import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any): any {
    const resValue = String(value).toUpperCase();

    if (!this.isValid(resValue)) {
      throw new BadRequestException(`${value} is not valid status`);
    }

    return resValue;
  }

  private isValid(status) {
    return this.allowedStatuses.includes(status);
  }
}