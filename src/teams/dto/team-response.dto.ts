import { Team } from "../entities/team.entity";


export class TeamResponse {
    totalRows: number;
    data: Team[];
}