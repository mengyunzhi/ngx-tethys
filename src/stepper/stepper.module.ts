import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThyStepHeaderComponent } from './step-header.component';
import { ThyStepComponent } from './step.component';
import { ThyStepperComponent } from './stepper.component';
import { ThyStepperNextDirective, ThyStepperPreviousDirective } from './stepper-button.directive';

@NgModule({
    declarations: [ThyStepHeaderComponent, ThyStepperComponent, ThyStepComponent, ThyStepperNextDirective, ThyStepperPreviousDirective],
    imports: [CommonModule],
    exports: [ThyStepperComponent, ThyStepComponent, ThyStepHeaderComponent, ThyStepperNextDirective, ThyStepperPreviousDirective],
    providers: []
})
export class ThyStepperModule {}
