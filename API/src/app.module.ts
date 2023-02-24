import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { config } from './config/configuration';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: config.DATABASE_HOST,
      port: parseInt(config.DATABASE_PORT),
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
      database: config.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: config.SENDGRID_HOST,
        auth: {
          user: config.SENDFRID_USERNAME,
          pass: config.SENDFRID_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
