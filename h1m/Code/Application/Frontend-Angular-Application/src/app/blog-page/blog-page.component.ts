import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../services-models/card.model';
import { DataMediatorService } from '../services-models/data-mediator.service';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css']
})
export class BlogPageComponent {
  data: any;
  paragraphs: String = '';
  constructor(private dataService: DataMediatorService) {
  }

  ngOnInit() {
    this.data = this.dataService.getData();
    this.paragraphs = this.data.content.split('\n');

    console.log(this.data);
  }
}
