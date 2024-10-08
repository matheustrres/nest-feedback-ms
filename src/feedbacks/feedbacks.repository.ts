import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	type FilterQuery,
	type QueryOptions,
	type Model,
	type SaveOptions,
	type UpdateWithAggregationPipeline,
	type UpdateQuery,
	type mongo,
	type MongooseUpdateQueryOptions,
} from 'mongoose';

import { Feedback, type FeedbackDoc } from './feedback.entity';

@Injectable()
export class FeedbacksRepository {
	constructor(
		@InjectModel(Feedback.name)
		private readonly model: Model<FeedbackDoc>,
	) {}

	async createOne(
		feedback: Feedback,
		saveOptions?: SaveOptions,
	): Promise<void> {
		const doc: FeedbackDoc = new this.model(feedback);

		await doc.save(saveOptions);
	}

	async find(
		filter: FilterQuery<Feedback>,
		queryOptions?: QueryOptions,
	): Promise<Feedback[]> {
		return this.model.find(filter, null, queryOptions);
	}

	async findOne(
		filter: FilterQuery<Feedback>,
		queryOptions?: QueryOptions,
	): Promise<Feedback | null> {
		return this.model.findOne(filter, queryOptions);
	}

	async findById(id: string): Promise<Feedback | null> {
		return this.model.findById(id);
	}

	async removeOne(id: string): Promise<void> {
		await this.model.deleteOne({
			id,
		});
	}

	async updateOne(
		filter?: FilterQuery<Feedback>,
		update?: UpdateWithAggregationPipeline | UpdateQuery<Feedback>,
		queryOptions?: mongo.UpdateOptions & MongooseUpdateQueryOptions<Feedback>,
	): Promise<void> {
		await this.model.updateOne(filter, update, queryOptions);
	}
}
