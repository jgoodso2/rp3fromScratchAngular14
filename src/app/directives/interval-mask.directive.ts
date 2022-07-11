import { Directive, EventEmitter, Component, Output } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[IntervalMask]',
  host: {
    '(ngModelChange)': 'onInputChange($event)',
    '(keydown)': 'onInputChange($event, true)'
  }
})
export class IntervalMaskDirective {

  constructor(public model: NgControl) { }
  @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();

  onInputChange(event:any, backspace:any) {
    var regex = /^\d+(\.\d+)?$/
    var newVal;
    if (regex.test(event.target.value + String.fromCharCode(event.keyCode))) {
      newVal = event.target.value;
    }
  
    else {
     //event.preventDefault();
     newVal =  '';
    }
    var rawValue = newVal;
    // remove all mask characters (keep only numeric)

    // // special handling of backspace necessary otherwise
    // // deleting of non-numeric characters is not recognized
    // // this laves room for improvment for example if you delete in the 
    // // middle of the string
    // if(backspace) {
    //   newVal = newVal.substring(0, newVal.length - 1);
    // } 

    // // don't show braces for empty value
    // if(newVal.length == 0) {
    //   newVal = '';
    // } 
    // // don't show braces for empty groups at the end
    // else if(newVal.length <= 3) {
    //   newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    // } else if(newVal.length <= 6) {
    //   newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) ($2)');
    // } else {
    //   newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) ($2)-$3');
    // }
    // set the new value
    this.model!.valueAccessor!.writeValue(newVal);
    this.rawChange.emit(rawValue)
  }

}
