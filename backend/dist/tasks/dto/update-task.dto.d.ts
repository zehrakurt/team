import { CreateTaskDto } from './create-task.dto';
import { TaskStatus, TaskPriority } from '@prisma/client';
declare const UpdateTaskDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTaskDto>>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
    status?: TaskStatus;
    priority?: TaskPriority;
}
export {};
