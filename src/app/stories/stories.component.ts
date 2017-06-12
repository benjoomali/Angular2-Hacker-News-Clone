import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { HackerNewsAPIService } from '../hackernews-api.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {
  items;
  typeSub: any;
  pageSub: any;
  storiesType;
  pageNum: number;
  listStart: number;

  constructor(
    private _hackerNewsAPIService: HackerNewsAPIService,
    private route: ActivatedRoute ) {}

  //subscribe to data stream and set the items attribute to what is returned
  ngOnInit() {
    //subscribe to the route data property and store storiesType into a component variable
    this.typeSub = this.route
                      .data
                      .subscribe(data => this.storiesType = (data as any).storiesType);

    //subscribe to the route paramaters and obtain the page number. then fetch the list of stories
    //using data service
    this.pageSub = this.route.params.subscribe(params => {
      this.pageNum = +params['page'] ? +params['page'] : 1;
      this._hackerNewsAPIService.fetchStories(this.storiesType, this.pageNum)
                                .subscribe(
                                  items => this.items = items,
                                  error => console.log('Error fetching' + this.storiesType + 'stories'),
                                  //increment listStart based on page number
                                  () => this.listStart = ((this.pageNum - 1) * 30) + 1);
                                  window.scrollTo(0, 0);
    });
  }
}
