import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { ResPlan, Resource } from '../../../app/interfaces/res-plan-model'
import { AppStateService } from '../../../app/services/app-state.service'

@Component({
  selector: 'fw-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public menuService: MenuService) { }

  ngOnInit() {
    
  }
}
