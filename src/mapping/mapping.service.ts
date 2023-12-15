import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserVM } from 'src/users/interfaces/userVM';

@Injectable()
export class MappingService {

    mapUserToUserVM(user): UserVM{

        let userVM: UserVM = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            lastName: user.lastName,
            fullName: user.fullName,
            employeeNumber: user.employeeNumber,
            isActive: user.isActive,
            projectId: user.teamId.projectId._id,
            projectName: user.teamId.projectId.name,
            roleId: user.roleId._id,
            roleName: user.roleId.roleName,
            teamId: user.teamId._id,
            teamName: user.teamId.teamName        
        };

        return userVM;
    }


}
