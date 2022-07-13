import { Component, OnInit } from '@angular/core';

import { MenuService } from '../services/menu.service';
import { ScreenService } from '../services/screen.service';

declare const $: any;

@Component({
  selector: 'fw-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(public menuService: MenuService,
              public screenService: ScreenService) { }

  ngOnInit() {
  // let contentBox = $('.body-style');
  // contentBox.scroll(function() {
  //         $('.ownBox').css('top', $(this).scrollTop() + "px");
  //     });
  // }
  }

}
