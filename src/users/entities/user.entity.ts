import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {
    _id?: string; 
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    lastName: string;

    @Prop({required: true})
    fullName: string;

    @Prop({unique: true, required: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({unique: true, required: true})
    employeeNumber: number

    @Prop({default: true})
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);