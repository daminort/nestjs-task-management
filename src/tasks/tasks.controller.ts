import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(public taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterTaskDto: FilterTaskDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`getTasks. User: ${user.name}, filter: ${JSON.stringify(filterTaskDto)}`);
    return this.taskService.getTasks(filterTaskDto, user);
  }

  @Get('/:id')
  getTaskByID(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`getTaskByID. User: ${user.name}, id: ${id}`);
    return this.taskService.getTaskByID(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`createTask. User: ${user.name}, task: ${JSON.stringify(createTaskDto)}`);
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`deleteTask. User: ${user.name}, id: ${id}`);
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`updateTaskStatus. User: ${user.name}, id: ${id}, status: ${status}`);
    return this.taskService.updateTaskStatus(id, status, user);
  }
}
