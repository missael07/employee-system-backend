import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class Role {
    
    @Prop({unique: true, required: true})
    roleName: string;

    @Prop({default: true})
    isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role)