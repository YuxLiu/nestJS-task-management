import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Post()
  // createTask(@Body() body) {
  //   console.log('body', body);
  // }
  // @Body('key') will parse request.body, extract value from json by key,
  // and convert according to type hint
  @Post()
  @UsePipes(ValidationPipe) // nestJs is smart enough to validate the Dto with Dto's decorator
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    // @Query parse '?status=OPEN&search=NestJS' in url into object
    // and assign to the var it decorated

    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    }
    return this.tasksService.getAllTasks();
    // nest.js will do jsonify etc. to translate it into http-response
  }

  @Get('/:id') // or ':id', they both work
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

}
