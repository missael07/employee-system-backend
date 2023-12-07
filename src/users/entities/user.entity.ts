import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {
    _id?: string; 
    @Prop({required: true, select: false })
    name: string;

    @Prop({required: true, select: false })
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

    @Prop({ type: 'ObjectId', ref: 'Project' })
    projectId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);