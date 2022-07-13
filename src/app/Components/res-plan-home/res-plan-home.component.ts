import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ResPlanHeaderRowComponent } from "../res-plan-header-row/res-plan-header-row.component"
//import { IResPlan } from "../res-plan.model"
declare var jquery: any;
declare var $: any;


@Component({
    selector: 'res-plan-home',
    templateUrl: './res-plan-home.component.html',
    styles: [`.outer-container
{
    background-color: #ccc;
    position: absolute;
    top:50px;
    left: 0;
    right: 0px;
    bottom: 40px;
    
}
.inner-container
{
    
    height:100%;
    overflow: hidden;
}
`]
})
export class ResPlanHomeComponent implements OnInit, AfterViewChecked {
 
    constructor() {
      
     }

    ngOnInit() {
    }

    ngAfterViewChecked() {
        this.setTableBody(false);
        $(window).resize(this.setTableBody(true));
        $(".table-body").scroll(function () {
            //$(".table-header").offset({ left: -1 * this.scrollLeft });
            $(".table-header").offset({ left: -1 * 1 });
        });

    }

    setTableBody(heightOnly: boolean) {
        $(".table-body").height($(".inner-container").height() - $(".table-header").height());
        if (heightOnly != true)
            $(".outer-container").width($(".table").width());

    }
}
