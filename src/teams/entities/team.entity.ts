import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class Team {
    
    @Prop({unique: true, required: true})
    teamName: string;

    @Prop({ type: 'ObjectId', ref: 'Project' })
    projectId: string;


    @Prop({default: true})
    isActive: boolean;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const TeamSchema = SchemaFactory.createForClass(Team)
