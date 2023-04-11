import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { configuration } from './config/configuration';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeOptions } from 'sequelize-typescript';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const DATABASE = configService.get('DATABASE');
                return {
                    dialect: 'postgres',
                    host: DATABASE.DATABASE_HOST,
                    port: DATABASE.DATABASE_PORT,
                    username: DATABASE.DATABASE_USERNAME,
                    password: DATABASE.DATABASE_PASSWORD,
                    database: DATABASE.DATABASE_NAME,
                    autoLoadModels: true,
                    synchronize: true,
                } as SequelizeOptions;
            },
            inject: [ConfigService],
        }),
        UsersModule,
        AuthModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const MAILER = configService.get('MAILER');
                return {
                    transport: {
                        host: MAILER.SENDGRID_HOST,
                        auth: {
                            user: MAILER.SENDFRID_USERNAME,
                            pass: MAILER.SENDFRID_PASSWORD,
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
