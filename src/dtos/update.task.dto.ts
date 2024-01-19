import { PriorityType, TaskStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateTaskDTO {
    @IsString({ message: "O campo 'nome da tarefa' deve ser preenchido." })
    task_name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(PriorityType)
    priority?: PriorityType;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    started_in?: Date;
    completed_in?: Date;

    
}