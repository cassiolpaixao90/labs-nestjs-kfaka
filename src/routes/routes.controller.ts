import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  OnModuleInit,
  Inject
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Producer } from '@nestjs/microservices/external/kafka.interface';

@Controller('routes')
export class RoutesController implements OnModuleInit {
  private producer: Producer;

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    private readonly routesService: RoutesService
  ) {}

  async onModuleInit() {
    this.producer = await this.kafkaClient.connect();
  }

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  async findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(+id, updateRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(+id);
  }

  @Get(':id/start')
  async startRoute(@Param('id') id: string) {
    return this.producer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({ routerId: id, clientId: '' })
        }
      ]
    });
  }
}
