import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Types, type HydratedDocument } from 'mongoose';

export type FeedbackDoc = HydratedDocument<Feedback>;

type FeedbackRet = {
	_id?: Types.ObjectId;
	__v?: string;
	id?: string;
};

@Schema({
	timestamps: true,
	toJSON: {
		transform: (_, ret: FeedbackRet): void => {
			ret.id = ret._id?.toString();

			delete ret._id;
			delete ret.__v;
		},
	},
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
