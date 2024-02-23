import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
  constructor(public ngControl: NgControl) {}

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event: string): void {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement) {
      this.onInputChange(inputElement.value, true);
    }
  }

  onInputChange(event: string, backspace: boolean): void {
    if (!event) {
      return;
    }
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '$1');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '$1.$2');
    } else if (newVal.length <= 9) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})/, '$1.$2.$3');
    } else {
      newVal = newVal.replace(
        /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/,
        '$1.$2.$3-$4'
      );
    }
    this.ngControl.valueAccessor?.writeValue(newVal);
  }
}
