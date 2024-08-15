import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { DatabaseModule } from './shared/modules/database/database.module';

@Module({
	imports: [DatabaseModule, FeedbacksModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
