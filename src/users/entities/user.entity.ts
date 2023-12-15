import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {
 
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    lastName: string;

    @Prop({required: true})
    fullName: string;

    @Prop({unique: true, required: true})
    email: string;

    @Prop({required: true, select: false })
    password: string;

    @Prop({unique: true, required: true})
    employeeNumber: number

    @Prop({default: true})
    isActive: boolean;

    @Prop({ type: 'ObjectId', ref: 'Team' })
    teamId: string;
    
    @Prop({ type: 'ObjectId', ref: 'UsersRole' })
    roleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);