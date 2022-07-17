import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'collapsible-well',
  templateUrl: './collapsible-well.component.html',
  styles: [`
  .well.pointable {
    margin-bottom: 0;
    margin-top: 0;
    padding-left: 0
    
}

.well.pointable {
    padding-bottom: .1em;
    padding-top: auto;
  
}

div {
  margin: 0;
  
}
.datesForPrint {
  display: none;
 
}

  `]
})
export class CollapsibleWellComponent {
  visible: boolean = true;

  toggleContent() {
    this.visible = !this.visible;
  }
}
