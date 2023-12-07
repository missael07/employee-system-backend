import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Project {

    @Prop({unique: true, required: true})
    name: string;

    @Prop({default: true})
    isActive: boolean;
}


export const ProjectSchema = SchemaFactory.createForClass(Project);