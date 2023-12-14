import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class UsersRole {
    
    @Prop({unique: true, required: true})
    roleName: string;

    @Prop({default: true})
    isActive: boolean;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const RoleSchema = SchemaFactory.createForClass(UsersRole)  