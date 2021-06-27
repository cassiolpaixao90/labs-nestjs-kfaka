import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RoutesModule,
    MongooseModule.forRoot(process.env.MONGO_DSN, { useNewUrlParser: true })
  ]
})
export class AppModule {}
