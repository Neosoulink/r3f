import { Module } from '@nestjs/common';

import { ExperienceGateway } from './experience.gateway';

@Module({
  providers: [ExperienceGateway],
})
export class ExperienceModule {}
