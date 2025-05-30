import { Directive, HostListener, inject } from '@angular/core';
import { ThyStepper } from './stepper.component';

/**
 * 在步进工作流中移动到下一个步骤的按钮
 * @description.en-us Button that moves to the next step in a stepper workflow.
 * @name thyStepperNext
 * @order 40
 */
@Directive({
    selector: '[thyStepperNext]'
})
export class ThyStepperNextDirective {
    private stepper = inject(ThyStepper);

    @HostListener('click', ['$event'])
    click($event: any) {
        this.stepper.next();
    }
}

/**
 * 在步进工作流中移动到上一个步骤的按钮
 * @description.en-us Button that moves to the previous step in a stepper workflow.
 * @name thyStepperPrevious
 * @order 30
 */
@Directive({
    selector: '[thyStepperPrevious]'
})
export class ThyStepperPreviousDirective {
    private stepper = inject(ThyStepper);

    @HostListener('click', ['$event'])
    click($event: any) {
        this.stepper.previous();
    }
}
