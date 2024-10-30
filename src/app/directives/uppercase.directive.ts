import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const value = event.target.value.toUpperCase();
    this.control.control?.setValue(value, { emitEvent: false });
  }
}
