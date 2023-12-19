import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';
import { Kupon } from './kupon';

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'szinhaz',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [adatok, mezok]=await conn.execute('select id, title, percentage, code FROM coupons');
    return { message: 'Kuponok', kuponok: adatok };
  }

  @Get('/newcoupon')
  @Render('newcoupon')
  newcoupon() {
    return { title: 'Új kupon felvétele' };
  }

  @Post('/newCoupon')
  async newCoupon(@Body() newCoupon: Kupon) {
    const cim=newCoupon.title;
    const szazalek:number=newCoupon.percentage;
    const kod=newCoupon.code;
    const [ adatok ]=await conn.execute('INSERT INTO coupons (title, percentage, code) VALUES (?, ?, ?)', [cim, szazalek, kod],
    );
    console.log(adatok);
    return {};
  }
}
