import { NgModule, Component, DebugElement, TemplateRef } from '@angular/core';
import { ThyProgressModule } from '../progress.module';
import { ComponentFixture, fakeAsync, TestBed, inject, tick, flushMicrotasks, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FocusMonitor } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThyProgressComponent } from '../progress.component';
import { ThyProgressBarComponent } from '../bar/progress-bar.component';
import { ThyProgressType, ThyProgressStackedValue } from '../interfaces';
import { hexToRgb } from '../../util/helpers';
import { ThyTooltipModule, ThyTooltipDirective } from '../../tooltip';
import { dispatchMouseEvent } from 'ngx-tethys/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const PROGRESS_CLASS_NAME = 'progress';
const PROGRESS_BAR_CLASS_NAME = 'progress-bar';
const TOOLTIP_CLASS = `thy-tooltip`;
const TOOLTIP_MESSAGE = 'this is a string tooltip';
const TOOLTIP_TEMPLATE_MESSAGE = 'this is a template message';

@Component({
    selector: 'thy-demo-progress-basic',
    template: `
        <button (click)="changeTemplate(demo)">
            Basic Usage
        </button>
        <thy-progress [thyValue]="value" [thyTips]="tips" [thyType]="type" [thySize]="size">
            20%
        </thy-progress>
        <ng-template #demo>{{ message }}</ng-template>
    `
})
class ThyDemoProgressBasicComponent {
    value = 20;
    type: ThyProgressType;
    size: string;
    tips: string | TemplateRef<HTMLElement> = TOOLTIP_MESSAGE;
    message = TOOLTIP_TEMPLATE_MESSAGE;
    changeTemplate(templateRef: TemplateRef<HTMLElement>) {
        this.tips = templateRef;
    }
}

@Component({
    selector: 'thy-demo-progress-stacked',
    template: `
        <thy-progress [thyValue]="value" [thySize]="size"> </thy-progress>
    `
})
class ThyDemoProgressStackedComponent {
    value: ThyProgressStackedValue[] = [
        {
            type: 'success',
            value: 40
        },
        {
            type: 'danger',
            value: 60,
            tips: 'hello world'
        },
        {
            type: 'warning',
            value: 100
        }
    ];
    size: string;
}

@Component({
    selector: 'thy-demo-progress-stacked-max',
    template: `
        <thy-progress [thyMax]="max" [thyValue]="value" [thySize]="size"> </thy-progress>
    `
})
class ThyDemoProgressStackedMaxComponent {
    value: ThyProgressStackedValue[] = [
        {
            type: 'success',
            value: 40
        },
        {
            type: 'danger',
            value: 60,
            tips: 'hello world'
        },
        {
            type: 'warning',
            value: 100
        }
    ];
    size: string;
    max = 100;
}

@Component({
    selector: 'thy-demo-progress-tooltip',
    template: `
        <thy-progress [thyValue]="value" [thyTips]="customProgressTooTip"></thy-progress>
        <ng-template #customProgressTooTip let-item>type: {{ item.type }}-value: {{ item.value }}</ng-template>
    `
})
class ThyDemoProgressTooltipTemplateComponent {
    value: ThyProgressStackedValue[] = [
        {
            type: 'success',
            value: 40
        },
        {
            type: 'danger',
            value: 60
        },
        {
            type: 'warning',
            value: 100
        }
    ];
    size: string;
}

function assertTooltipInstance(tooltip: ThyTooltipDirective, shouldExist: boolean): void {
    expect(!!tooltip['tooltipInstance']).toBe(shouldExist);
}

@NgModule({
    imports: [ThyProgressModule],
    declarations: [
        ThyDemoProgressBasicComponent,
        ThyDemoProgressStackedComponent,
        ThyDemoProgressStackedMaxComponent,
        ThyDemoProgressTooltipTemplateComponent
    ],
    exports: [ThyDemoProgressBasicComponent]
})
export class ProgressTestModule {}

describe(`ThyProgressComponent`, () => {
    describe(`basic`, () => {
        let fixture: ComponentFixture<ThyDemoProgressBasicComponent>;
        let basicTestComponent: ThyDemoProgressBasicComponent;
        let progressComponent: DebugElement;
        let progressBarComponent: DebugElement;
        let progressElement: HTMLElement;
        let progressBarElement: HTMLElement;
        let progressBarInnerElement: HTMLElement;
        let tooltipDirective: ThyTooltipDirective;
        let overlayContainer: OverlayContainer;
        let overlayContainerElement: HTMLElement;

        function getTooltipVisible() {
            return tooltipDirective['isTooltipVisible']();
        }

        beforeEach(fakeAsync(() => {
            TestBed.configureTestingModule({
                imports: [ThyProgressModule, ProgressTestModule, NoopAnimationsModule],
                providers: [
                    // { provide: Location, useClass: SpyLocation }
                ]
            });

            TestBed.compileComponents();

            inject([OverlayContainer, FocusMonitor], (oc: OverlayContainer, fm: FocusMonitor) => {
                overlayContainer = oc;
                overlayContainerElement = oc.getContainerElement();
                // focusMonitor = fm;
            })();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThyDemoProgressBasicComponent);
            basicTestComponent = fixture.debugElement.componentInstance;
            progressComponent = fixture.debugElement.query(By.directive(ThyProgressComponent));
            progressElement = progressComponent.nativeElement;
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
        });

        function assertProgressAndBarComponentClass(styleWidth: string = '20%') {
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            const barElement = progressBarComponent.nativeElement;
            expect(barElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            expect(barElement.style.width).toEqual(styleWidth);
        }

        it('should be created progress component', () => {
            expect(progressComponent).toBeTruthy();
        });

        it('should be correct class by default type', () => {
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            assertProgressAndBarComponentClass();
        });

        it('should be correct class when input type is success or warning', () => {
            basicTestComponent.type = 'success';
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            progressBarElement = progressBarComponent.nativeElement;
            progressBarInnerElement = fixture.debugElement.query(By.css('.progress-bar-inner')).nativeElement;
            assertProgressAndBarComponentClass();
            expect(progressBarElement.classList.contains(`progress-bar-${basicTestComponent.type}`)).toBe(true);

            basicTestComponent.type = 'warning';
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            progressBarElement = progressBarComponent.nativeElement;
            progressBarInnerElement = fixture.debugElement.query(By.css('.progress-bar-inner')).nativeElement;
            assertProgressAndBarComponentClass();
            expect(progressBarElement.classList.contains(`progress-bar-${basicTestComponent.type}`)).toBe(true);
        });

        it('should be correct class when input size is sm', () => {
            basicTestComponent.size = 'sm';
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            assertProgressAndBarComponentClass();
            expect(progressElement.classList.contains('progress-sm')).toBe(true);
        });

        it('should be correct percent with dynamically changed values', () => {
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            progressBarElement = progressBarComponent.nativeElement;
            assertProgressAndBarComponentClass();

            basicTestComponent.value = 30;
            fixture.detectChanges();
            expect(progressBarElement.style.width).toEqual('30%');
        });

        it('should be have a tooltip use string', fakeAsync(() => {
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            progressBarElement = progressBarComponent.nativeElement;

            tooltipDirective = progressBarComponent.injector.get<ThyTooltipDirective>(ThyTooltipDirective);
            assertTooltipInstance(tooltipDirective, false);
            // fake mouseenter event
            dispatchMouseEvent(progressBarElement, 'mouseenter');
            expect(getTooltipVisible()).toBe(false);
            assertTooltipInstance(tooltipDirective, true);
            tick(200);
            expect(getTooltipVisible()).toBe(true);
            expect(overlayContainerElement.textContent).toEqual('');
            fixture.detectChanges();
            const tooltipElement = overlayContainerElement.querySelector(`.${TOOLTIP_CLASS}`) as HTMLElement;
            expect(tooltipElement instanceof HTMLElement).toBe(true);
            expect(tooltipElement.textContent.trim()).toEqual(TOOLTIP_MESSAGE);
            const tooltipHideDelay = 100; // default hide delay is 100
            // fake mouseleave event
            dispatchMouseEvent(progressBarElement, 'mouseleave');
            expect(getTooltipVisible()).toBe(true);

            tick(tooltipHideDelay);
            fixture.detectChanges();
            expect(getTooltipVisible()).toBe(false);
            assertTooltipInstance(tooltipDirective, true);

            // On animation complete, should expect that the tooltip has been detached.
            flushMicrotasks();
            assertTooltipInstance(tooltipDirective, false);
        }));

        it('should be have a tooltip use string', fakeAsync(() => {
            const buttonDebugElement = fixture.debugElement.query(By.css('button'));
            const buttonElement = buttonDebugElement.nativeElement;
            buttonElement.click();
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            progressBarElement = progressBarComponent.nativeElement;

            tooltipDirective = progressBarComponent.injector.get<ThyTooltipDirective>(ThyTooltipDirective);
            assertTooltipInstance(tooltipDirective, false);
            // fake mouseenter event
            dispatchMouseEvent(progressBarElement, 'mouseenter');
            expect(getTooltipVisible()).toBe(false);
            assertTooltipInstance(tooltipDirective, true);
            tick(200);
            expect(getTooltipVisible()).toBe(true);
            expect(overlayContainerElement.textContent).toEqual('');
            fixture.detectChanges();
            const tooltipElement = overlayContainerElement.querySelector(`.${TOOLTIP_CLASS}`) as HTMLElement;
            expect(tooltipElement instanceof HTMLElement).toBe(true);
            expect(tooltipElement.textContent.trim()).toEqual(TOOLTIP_TEMPLATE_MESSAGE);
            const tooltipHideDelay = 100; // default hide delay is 100
            // fake mouseleave event
            dispatchMouseEvent(progressBarElement, 'mouseleave');
            expect(getTooltipVisible()).toBe(true);

            tick(tooltipHideDelay);
            fixture.detectChanges();
            expect(getTooltipVisible()).toBe(false);
            assertTooltipInstance(tooltipDirective, true);

            // On animation complete, should expect that the tooltip has been detached.
            flushMicrotasks();
            assertTooltipInstance(tooltipDirective, false);
        }));
    });

    describe(`stacked`, () => {
        let fixture: ComponentFixture<ThyDemoProgressStackedComponent>;
        let stackedTestComponent: ThyDemoProgressStackedComponent;
        let progressComponent: DebugElement;
        let progressBarComponents: DebugElement[];
        let progressElement: HTMLElement;
        let progressBarElements: HTMLElement[];
        let progressBarElement: HTMLElement;
        let progressTooltipBarElement: HTMLElement;
        let overlayContainer: OverlayContainer;
        let overlayContainerElement: HTMLElement;
        let tooltipDirective: ThyTooltipDirective;

        function getTooltipVisible() {
            return tooltipDirective['isTooltipVisible']();
        }

        beforeEach(fakeAsync(() => {
            TestBed.configureTestingModule({
                imports: [ThyProgressModule, ProgressTestModule, NoopAnimationsModule],
                providers: [
                    // { provide: Location, useClass: SpyLocation }
                ]
            });

            TestBed.compileComponents();

            inject([OverlayContainer, FocusMonitor], (oc: OverlayContainer, fm: FocusMonitor) => {
                overlayContainer = oc;
                overlayContainerElement = oc.getContainerElement();
                // focusMonitor = fm;
            })();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThyDemoProgressStackedComponent);
            stackedTestComponent = fixture.debugElement.componentInstance;
            progressComponent = fixture.debugElement.query(By.directive(ThyProgressComponent));
            progressElement = progressComponent.nativeElement;
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
        });

        it('should be created progress component', () => {
            expect(progressComponent).toBeTruthy();
        });

        it('should be correct class by stacked value', () => {
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            expect(progressBarElements.length).toBe(3);
            progressBarElements.forEach(progressBarElement => {
                expect(progressBarElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            });
            expect(progressBarElements[0].style.width).toEqual('20%');
            expect(progressBarElements[1].style.width).toEqual('30%');
            expect(progressBarElements[2].style.width).toEqual('50%');
        });

        it('should be have a tooltip in second progress bar', fakeAsync(() => {
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressBarElements.length).toBe(3);

            progressBarElement = progressBarComponents[0].nativeElement;
            progressTooltipBarElement = progressBarComponents[1].nativeElement;

            const progressTooltipBarComponent = progressBarComponents[1];
            const progressBarComponent = progressBarComponents[0];
            tooltipDirective = progressBarComponent.injector.get<ThyTooltipDirective>(ThyTooltipDirective);

            // fake mouseenter event
            dispatchMouseEvent(progressBarElement, 'mouseenter');
            tick(200);
            expect(overlayContainerElement.textContent).toEqual('');
            assertTooltipInstance(tooltipDirective, false);
            dispatchMouseEvent(progressBarElement, 'mouseleave');
            tick(100);
            fixture.detectChanges();

            tooltipDirective = progressTooltipBarComponent.injector.get<ThyTooltipDirective>(ThyTooltipDirective);
            dispatchMouseEvent(progressTooltipBarElement, 'mouseenter');
            expect(getTooltipVisible()).toBe(false);
            tick(200);
            expect(getTooltipVisible()).toBe(true);
            expect(overlayContainerElement.textContent).toEqual('');
            fixture.detectChanges();
            const tooltip = stackedTestComponent.value[1].tips;
            const tooltipElement = overlayContainerElement.querySelector(`.${TOOLTIP_CLASS}`) as HTMLElement;
            expect(tooltipElement instanceof HTMLElement).toBe(true);
            expect(tooltipElement.textContent).toEqual(` ${tooltip} `);
            const tooltipHideDelay = 100; // default hide delay is 100
            // fake mouseleave event
            dispatchMouseEvent(progressTooltipBarElement, 'mouseleave');
            expect(getTooltipVisible()).toBe(true);

            tick(tooltipHideDelay);
            fixture.detectChanges();
            expect(getTooltipVisible()).toBe(false);
            assertTooltipInstance(tooltipDirective, true);

            // On animation complete, should expect that the tooltip has been detached.
            flushMicrotasks();
            assertTooltipInstance(tooltipDirective, false);
        }));

        it('should be correct color by custom stacked value with color', () => {
            stackedTestComponent.value = [
                {
                    value: 20,
                    color: '#4e8af9'
                },
                {
                    value: 40,
                    color: '#66c060'
                },
                {
                    value: 80,
                    color: '#ffd234'
                }
            ];
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            expect(progressBarElements.length).toBe(3);
            progressBarElements.forEach(progressBarElement => {
                expect(progressBarElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            });

            expect(progressBarElements[0].style.width).toEqual('14.29%');
            expect(progressBarElements[1].style.width).toEqual('28.57%');
            expect(progressBarElements[2].style.width).toEqual('57.14%');

            expect((progressBarElements[0].querySelector('.progress-bar-inner') as HTMLElement).style['background-color']).toEqual(
                hexToRgb('#4e8af9')
            );
            expect((progressBarElements[1].querySelector('.progress-bar-inner') as HTMLElement).style['background-color']).toEqual(
                hexToRgb('#66c060')
            );
            expect((progressBarElements[2].querySelector('.progress-bar-inner') as HTMLElement).style['background-color']).toEqual(
                hexToRgb('#ffd234')
            );
        });
    });

    describe(`stacked has max`, () => {
        let fixture: ComponentFixture<ThyDemoProgressStackedMaxComponent>;
        let stackedTestComponent: ThyDemoProgressStackedMaxComponent;
        let progressComponent: DebugElement;
        let progressBarComponents: DebugElement[];
        let progressElement: HTMLElement;
        let progressBarElements: HTMLElement[];
        let overlayContainer: OverlayContainer;
        let overlayContainerElement: HTMLElement;

        beforeEach(fakeAsync(() => {
            TestBed.configureTestingModule({
                imports: [ThyProgressModule, ProgressTestModule, NoopAnimationsModule]
            });

            TestBed.compileComponents();

            inject([OverlayContainer, FocusMonitor], (oc: OverlayContainer, fm: FocusMonitor) => {
                overlayContainer = oc;
                overlayContainerElement = oc.getContainerElement();
                // focusMonitor = fm;
            })();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThyDemoProgressStackedMaxComponent);
            stackedTestComponent = fixture.debugElement.componentInstance;
            progressComponent = fixture.debugElement.query(By.directive(ThyProgressComponent));
            progressElement = progressComponent.nativeElement;
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
        });

        it('should be correct value by custom stacked value has max ', () => {
            stackedTestComponent.value = [
                {
                    type: 'success',
                    value: 20
                },
                {
                    type: 'warning',
                    value: 20
                },
                {
                    type: 'danger',
                    value: 20
                },
                {
                    type: 'info',
                    value: 30,
                    color: '#7076fa',
                    label: 'custom color'
                }
            ];
            stackedTestComponent.max = 180;
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            expect(progressBarElements.length).toBe(4);
            progressBarElements.forEach(progressBarElement => {
                expect(progressBarElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            });

            expect(progressBarElements[0].style.width).toEqual('11.11%');
            expect(progressBarElements[1].style.width).toEqual('11.11%');
            expect(progressBarElements[2].style.width).toEqual('11.11%');
            expect(progressBarElements[3].style.width).toEqual('16.67%');
            expect((progressBarElements[3].querySelector('.progress-bar-inner') as HTMLElement).style['background-color']).toEqual(
                hexToRgb('#7076fa')
            );
        });

        it('should be correct values item value has 0 by custom stacked value has max ', () => {
            stackedTestComponent.value = [
                {
                    type: 'success',
                    value: 0
                },
                {
                    type: 'warning',
                    value: 20
                },
                {
                    type: 'danger',
                    value: 20
                }
            ];
            stackedTestComponent.max = 40;
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            expect(progressBarElements.length).toBe(2);
            progressBarElements.forEach(progressBarElement => {
                expect(progressBarElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            });

            expect(progressBarElements[0].style.width).toEqual('50%');
            expect(progressBarElements[1].style.width).toEqual('50%');
        });

        it('should be correct values item value has 0 and total greater than max by custom stacked value', () => {
            stackedTestComponent.value = [
                {
                    type: 'success',
                    value: 0
                },
                {
                    type: 'warning',
                    value: 20
                },
                {
                    type: 'danger',
                    value: 20
                }
            ];
            stackedTestComponent.max = 30;
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            expect(progressBarElements.length).toBe(2);
            progressBarElements.forEach(progressBarElement => {
                expect(progressBarElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            });

            expect(progressBarElements[0].style.width).toEqual('50%');
            expect(progressBarElements[1].style.width).toEqual('50%');
        });

        it('should be correct when value or max is change', () => {
            stackedTestComponent.value = [
                {
                    type: 'warning',
                    value: 30
                }
            ];
            stackedTestComponent.max = 90;
            fixture.detectChanges();
            let progressBarComponent = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent))[0].nativeElement;
            expect(progressBarComponent.style.width).toEqual('33.33%');

            fixture.detectChanges();
            stackedTestComponent.value = [
                {
                    type: 'warning',
                    value: 100
                }
            ];
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent))[0].nativeElement;
            expect(progressBarComponent.style.width).toEqual('100%');

            fixture.detectChanges();
            stackedTestComponent.value = [
                {
                    type: 'warning',
                    value: 45
                }
            ];
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent))[0].nativeElement;
            expect(progressBarComponent.style.width).toEqual('50%');

            fixture.detectChanges();
            stackedTestComponent.max = 180;
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent))[0].nativeElement;
            expect(progressBarComponent.style.width).toEqual('25%');

            fixture.detectChanges();
            stackedTestComponent.max = 90;
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent))[0].nativeElement;
            expect(progressBarComponent.style.width).toEqual('50%');

            fixture.detectChanges();
            stackedTestComponent.value = [
                {
                    type: 'warning',
                    value: 90
                }
            ];
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent))[0].nativeElement;
            expect(progressBarComponent.style.width).toEqual('100%');
        });

        it('should be correct value with 0 by custom stacked value has max with 0 ', () => {
            stackedTestComponent.value = [];
            stackedTestComponent.max = 0;
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            expect(progressBarElements.length).toBe(0);
            progressBarElements.forEach(progressBarElement => {
                expect(
                    (progressBarElement.querySelector('.progress-bar-inner') as HTMLElement).classList.contains(PROGRESS_BAR_CLASS_NAME)
                ).toBe(true);
            });
        });
    });

    describe(`tooltipTemplate`, () => {
        let fixture: ComponentFixture<ThyDemoProgressTooltipTemplateComponent>;
        let toolTipTemplateTestComponent: ThyDemoProgressTooltipTemplateComponent;
        let progressComponent: DebugElement;
        let progressBarComponents: DebugElement[];
        let progressElement: HTMLElement;
        let tooltipDirective: ThyTooltipDirective;
        let progressBarElements: HTMLElement[];
        let progressBarElement: HTMLElement;
        let overlayContainer: OverlayContainer;
        let overlayContainerElement: HTMLElement;

        function getTooltipVisible() {
            return tooltipDirective['isTooltipVisible']();
        }

        beforeEach(fakeAsync(() => {
            TestBed.configureTestingModule({
                imports: [ThyProgressModule, ProgressTestModule, NoopAnimationsModule],
                providers: [
                    // { provide: Location, useClass: SpyLocation }
                ]
            });

            TestBed.compileComponents();

            inject([OverlayContainer, FocusMonitor], (oc: OverlayContainer, fm: FocusMonitor) => {
                overlayContainer = oc;
                overlayContainerElement = oc.getContainerElement();
                // focusMonitor = fm;
            })();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThyDemoProgressTooltipTemplateComponent);
            toolTipTemplateTestComponent = fixture.debugElement.componentInstance;
            progressComponent = fixture.debugElement.query(By.directive(ThyProgressComponent));
            progressElement = progressComponent.nativeElement;
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
        });

        it('should be created progress component', () => {
            expect(progressComponent).toBeTruthy();
        });

        it('should be created progress tooltip component width component', fakeAsync(() => {
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressBarElements.length).toBe(3);
            progressBarElement = progressBarComponents[0].nativeElement;
            const progressBarComponent = progressBarComponents[0];
            tooltipDirective = progressBarComponent.injector.get<ThyTooltipDirective>(ThyTooltipDirective);
            assertTooltipInstance(tooltipDirective, false);

            // fake mouseenter event
            dispatchMouseEvent(progressBarElement, 'mouseenter');
            expect(getTooltipVisible()).toBe(false);
            assertTooltipInstance(tooltipDirective, true);
            tick(200);
            expect(getTooltipVisible()).toBe(true);
            expect(overlayContainerElement.textContent).toEqual('');
            fixture.detectChanges();
            const data = toolTipTemplateTestComponent.value[0];
            const tooltipElement = overlayContainerElement.querySelector(`.${TOOLTIP_CLASS}`) as HTMLElement;
            const text = `type: ${data.type}-value: ${data.value}`;

            expect(tooltipElement instanceof HTMLElement).toBe(true);
            expect(tooltipElement.textContent).toEqual(text);
            const tooltipHideDelay = 100; // default hide delay is 100
            // fake mouseleave event
            dispatchMouseEvent(progressBarElement, 'mouseleave');
            expect(getTooltipVisible()).toBe(true);

            tick(tooltipHideDelay);
            fixture.detectChanges();
            expect(getTooltipVisible()).toBe(false);
            assertTooltipInstance(tooltipDirective, true);

            // On animation complete, should expect that the tooltip has been detached.
            flushMicrotasks();
            assertTooltipInstance(tooltipDirective, false);
        }));
    });
});
