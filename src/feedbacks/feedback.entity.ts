import { randomUUID } from 'node:crypto';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Types, type HydratedDocument } from 'mongoose';

export type FeedbackDoc = HydratedDocument<Feedback>;

export type FeedbackProps = {
	userId: string;
	productId: string;
	comment: string;
	rating: number;
};

type FeedbackRet = {
	_id?: Types.ObjectId;
	__v?: string;
	id?: string;
};

@Schema({
	toJSON: {
		transform: (_, ret: FeedbackRet): void => {
			delete ret._id;
			delete ret.__v;
		},
	},
})
export class Feedback {
	@Prop({
		type: 'string',
		required: true,
	})
	id!: string;

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

	@Prop({
		name: 'created_at',
		required: true,
		type: Date,
	})
	createdAt!: string | Date;

	@Prop({
		name: 'updated_at',
		required: true,
		type: Date,
	})
	updatedAt!: string | Date;

	constructor(feedbackProps: FeedbackProps) {
		this.id = randomUUID();
		this.userId = feedbackProps.userId;
		this.productId = feedbackProps.productId;
		this.comment = feedbackProps.comment;
		this.rating = feedbackProps.rating;
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
