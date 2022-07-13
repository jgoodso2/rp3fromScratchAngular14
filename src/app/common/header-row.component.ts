import { Component, Input } from '@angular/core';
import { IResPlan }  from '../../app/interfaces/res-plan-model'

@Component({
  selector: 'header-row',
  templateUrl: './header-row.component.html'
})
export class HeaderRowComponent {
  visible: boolean = true;
  @Input() _resPlans: IResPlan[];
    ngOnInit(): void {
        console.log('init fired');
        console.log(this._resPlans)


    }

}