import { Project } from "../entities/project.entity";

export class ProjectResponse {
    totalRows: number;
    data: Project[];
}