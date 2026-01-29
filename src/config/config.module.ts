import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import authConfig from './auth/config';
import databaseConfig from './database/config';
import emailConfig from './email/config';
import redisConfig from './redis/config';
import { authConfigSchema } from './auth/config.schema';
import { databaseConfigSchema } from './database/config.schema';
import { emailConfigSchema } from './email/config.schema';
import { redisConfigSchema } from './redis/config.schema';
import { AuthConfigService } from './auth/config.service';
import { DatabaseConfigService } from './database/config.service';
import { EmailConfigService } from './email/config.service';
import { RedisConfigService } from './redis/config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, databaseConfig, emailConfig, redisConfig],
      expandVariables: true,
      validationSchema: [
        authConfigSchema,
        databaseConfigSchema,
        emailConfigSchema,
        redisConfigSchema,
      ],
      validate: (env) => {
        authConfigSchema.parse(env);
        databaseConfigSchema.parse(env);
        emailConfigSchema.parse(env);
        redisConfigSchema.parse(env);
        return env;
      },
    }),
  ],
  providers: [
    AuthConfigService,
    DatabaseConfigService,
    EmailConfigService,
    RedisConfigService,
  ],
  exports: [
    AuthConfigService,
    DatabaseConfigService,
    EmailConfigService,
    RedisConfigService,
  ],
})
export class ConfigModule {}
