import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

export type FeedbackDoc = HydratedDocument<Feedback>;

@Schema({
	id: true,
	toObject: {
		getters: true,
		minimize: true,
	},
	timestamps: true,
})
export class Feedback {
	@Prop({
		name: 'userId',
		required: true,
	})
	userId!: string;

	@Prop({
		name: 'product_id',
		required: true,
	})
	productId!: string;

	@Prop({
		required: true,
		minlength: 20,
		maxlength: 255,
	})
	comment!: string;

	@Prop({
		required: true,
		isInteger: true,
		min: 0,
		max: 5,
	})
	rating!: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
