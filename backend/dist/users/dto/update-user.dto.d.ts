import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    currentPassword?: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    role?: Role;
}
