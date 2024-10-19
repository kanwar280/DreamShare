import { Component, AfterViewInit , ViewChild , ElementRef , Renderer2} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as $ from 'jquery';
import * as AWS from 'aws-sdk';
import { DataServiceService } from './data-service.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{


}