import { Controller, Get } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
