import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ORIGINS } from './constants/constant';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.enableCors({
    //     origin: ORIGINS,
    // });
    app.enableCors();
    await app.listen(3000);
}
bootstrap();
