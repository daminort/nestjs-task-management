import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getFilteredTasks(filterTaskDto: FilterTaskDto): Task[] {
    const { status, search } = filterTaskDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search)
        || task.description.includes(search)
      );
    }

    return tasks;
  }

  public getTaskByID(id: string): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  public createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      title,
      description,
      id: uuid(),
      status: TaskStatus.OPEN,
    }

    this.tasks.push(task);

    return task;
  }

  public deleteTask(id: string): string {
    const existedTask = this.getTaskByID(id);
    this.tasks = this.tasks.filter(task => task.id !== existedTask.id);
    
    return id;
  }

  public updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskByID(id);
    task.status = status;

    return task;
  }
}
