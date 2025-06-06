import { EXPANDED_DROPDOWN_POSITIONS } from 'ngx-tethys/core';
import { dispatchFakeEvent, typeInElement } from 'ngx-tethys/testing';
import { SafeAny } from 'ngx-tethys/types';
import { Subject, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { CommonModule, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, fakeAsync, flush, inject, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ThyCascaderModule, ThyCascaderExpandTrigger, ThyCascaderTriggerType, ThyCascader } from 'ngx-tethys/cascader';
import { ThyFlexibleTextModule } from 'ngx-tethys/flexible-text';
import { ThyIconModule } from 'ngx-tethys/icon';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

registerLocaleData(zh);

function clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

const customerOptions = [
    {
        value: 'zhejiang',
        label: 'zhejiang',
        code: 477200,
        children: [
            {
                value: 'hangzhou',
                label: 'hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'xihu',
                        code: 752100,
                        isLeaf: true
                    }
                ]
            }
        ]
    },
    {
        value: 'beijng',
        label: 'beijng',
        code: 477400,
        readonly: true,
        isLeaf: true
    },
    {
        value: 'jiangsu',
        label: 'jiangsu',
        disabled: true,
        children: [
            {
                value: 'nanjing',
                label: 'nanjing',
                disabled: true,
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'zhonghuamen',
                        code: 453400,
                        isLeaf: true,
                        disabled: true
                    }
                ]
            }
        ]
    }
];

const multipleOptions = [
    {
        value: 'beijing',
        label: 'beijing',
        children: [
            {
                value: 'shixiaqu',
                label: 'shixiaqu',
                children: [
                    {
                        value: 'haidianqu',
                        label: 'haidianqu',
                        isLeaf: true
                    }
                ]
            }
        ]
    },
    {
        value: 'tianjinshi',
        label: 'tianjinshi',
        children: [
            {
                value: 'shixiaqu',
                label: 'shixiaqu',
                children: [
                    {
                        value: 'hepingqu',
                        label: 'hepingqu',
                        isLeaf: true
                    }
                ]
            }
        ]
    },
    {
        value: 'jilinsheng',
        label: 'jilinsheng',
        children: [
            {
                value: 'liaoyuanshi',
                label: 'liaoyuanshi',
                children: [
                    {
                        value: 'longshanqu',
                        label: 'longshanqu',
                        isLeaf: true
                    },
                    {
                        value: 'xianqu',
                        label: 'xianqu',
                        isLeaf: true
                    },
                    {
                        value: 'dongfengxian',
                        label: 'dongfengxian',
                        isLeaf: true
                    },
                    {
                        value: 'dongliaoxian',
                        label: 'dongliaoxian',
                        isLeaf: true
                    }
                ]
            }
        ]
    },
    {
        value: 'jiangsusheng',
        label: 'jiangsusheng',
        children: [
            {
                value: 'nanjingshi',
                label: 'nanjingshi',
                children: [
                    {
                        value: 'xuanxushi',
                        label: 'xuanxushi',
                        isLeaf: true
                    }
                ]
            }
        ]
    },
    {
        value: 'shanghaishi',
        label: 'shanghaishi',
        children: [
            {
                value: 'shixiaqu',
                label: 'shixiaqu',
                children: [
                    {
                        value: 'hongkouqu',
                        label: 'hongkouqu',
                        isLeaf: true
                    }
                ]
            }
        ]
    },
    {
        value: 'zhejiang',
        label: 'zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'xihu',
                        isLeaf: true
                    }
                ]
            }
        ]
    }
];

const emptyOptions = [
    {
        value: 'zhejiang',
        label: 'zhejiang',
        code: 477200,
        children: [
            {
                value: 'hangzhou',
                label: 'hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'xihu',
                        code: 752100,
                        isLeaf: true
                    }
                ]
            }
        ]
    },
    {
        value: 'anhui',
        label: 'anhui',
        code: 477201,
        children: []
    }
];

const loadDataOption: { [key: string]: { children?: any[]; [key: string]: any }[] } = {
    root: [
        {
            value: 'zhejiang',
            label: 'zhejiang',
            code: 477200,
            children: []
        },
        {
            value: 'anhui',
            label: 'anhui',
            code: 477201,
            children: []
        }
    ],
    firstChildren: [
        {
            value: 'hangzhou',
            label: 'hangzhou',
            children: [
                {
                    value: 'xihu',
                    label: 'xihu',
                    code: 752100,
                    isLeaf: true
                }
            ]
        }
    ]
};

const customLabelPropertyOptions = [
    {
        _id: '65518b58c012b3be15145d4d',
        text: '丁',
        children: [],
        isLeaf: true
    },
    {
        _id: '65518b58c012b3be15145d4a',
        text: '甲',
        children: [
            {
                _id: '65518b58c012b3be15145d51',
                text: '子',
                children: [
                    {
                        _id: '6555d557dae9459d8466421a',
                        text: '十一点',
                        isLeaf: true
                    }
                ],
                isLeaf: false
            },
            {
                _id: '65518b58c012b3be15145d50',
                text: '丑',
                children: [
                    {
                        _id: '6555d557dae9459d8466421b',
                        text: '一点',
                        isLeaf: true
                    }
                ],
                isLeaf: false
            },
            {
                _id: '65518b58c012b3be15145d4f',
                text: '寅',
                children: [
                    {
                        _id: '6555d557dae9459d8466421c',
                        text: '三点',
                        isLeaf: true
                    }
                ],
                isLeaf: false
            },
            {
                _id: '65518b58c012b3be15145d4e',
                text: '卯',
                isLeaf: true
            }
        ],
        isLeaf: false
    }
];

@Component({
    selector: 'thy-cascader-basic',
    template: `
        @if (thyChangeOnSelect) {
            <button class="cancel-anchor">取消锚点</button>
        }

        <thy-cascader
            #cascader
            [thyOptions]="thyCustomerOptions"
            (ngModelChange)="onChanges($event)"
            [(ngModel)]="curVal"
            style="width:400px;"
            [thyPlaceholder]="placeholder"
            [thyTriggerAction]="thyTriggerAction"
            [thyExpandTriggerAction]="thyExpandTriggerAction"
            [thyChangeOnSelect]="thyChangeOnSelect"
            [thyMenuClassName]="thyMenuClassName"
            [thyColumnClassName]="columnClassName"
            [thyLoadData]="loadData"
            [thyShowSearch]="isShowSearch"
            [thyDisabled]="disabled"
            [thyIsOnlySelectLeaf]="isOnlySelectLeaf"
            [thyEmptyStateText]="emptyStateText"
            [thyMultiple]="isMultiple"
            (thyExpandStatusChange)="thyExpandStatusChange($event)"
            [thyAutoExpand]="thyAutoExpand"
            [thyCustomOptions]="customOptions"
            [thyHasBackdrop]="hasBackdrop">
        </thy-cascader>
    `,
    imports: [FormsModule, CommonModule, OverlayModule, ThyCascaderModule, ThyFlexibleTextModule, ThyIconModule]
})
class CascaderBasicComponent {
    @ViewChild(ThyCascader, { static: false }) cascader: ThyCascader;

    public thyTriggerAction: ThyCascaderTriggerType = 'click';
    public thyExpandTriggerAction: ThyCascaderExpandTrigger = 'click';
    public curVal: string | string[] = null;
    public placeholder = '';
    public thyCustomerOptions: any[] = clone(customerOptions);
    public thyChangeOnSelect = false;
    public thyMenuClassName = 'test-menu-class';
    public columnClassName = 'column-menu-class';
    public loadData: any;
    public isShowSearch: boolean = false;
    public emptyStateText = '无选项';
    public disabled = false;
    public isOnlySelectLeaf = true;
    public isMultiple = false;
    public thyAutoExpand = true;
    public hasBackdrop: boolean;
    public customOptions: SafeAny[];

    @ViewChild('cascader', { static: true }) cascaderRef: ThyCascader;

    thyExpandStatusChange = jasmine.createSpy('thyExpandStatusChange callback');

    // onChanges = jasmine.createSpy('onChanges callback');

    changeValue$ = new Subject<string[]>();
    constructor() {}
    onChanges(e: string[]) {
        this.changeValue$.next(e);
    }

    public setOptionsForAsync() {
        of(true)
            .pipe(delay(200))
            .subscribe(() => {
                this.thyCustomerOptions = clone(customerOptions);
            });
    }

    public setCustomOptions() {
        const customOptions: SafeAny[] = [
            { label: '全部', value: 'all', children: [], isLeaf: true },
            { label: '自定义选项2', value: 'custom_option_1', children: [], isLeaf: true }
        ];
        this.customOptions = customOptions;
        return customOptions;
    }
}
@Component({
    selector: 'thy-cascader-load',
    template: ` <thy-cascader [thyLoadData]="thyLoadData" [(ngModel)]="curVal" style="width:400px;"> </thy-cascader> `,
    imports: [FormsModule, CommonModule, OverlayModule, ThyCascaderModule, ThyFlexibleTextModule, ThyIconModule]
})
class CascaderLoadComponent {
    success = true;
    public curVal: string | string[] = 'zhejiang';

    constructor() {}

    thyLoadData = (option: any) => {
        return new Promise<void>((res, rej) => {
            if (this.success) {
                option.children = clone(customerOptions);
                res();
            } else {
                rej();
            }
        });
    };
}
@Component({
    selector: 'thy-cascader-template',
    template: `
        <thy-cascader
            [thyOptions]="thyCustomerOptions"
            [thyShowSearch]="true"
            [(ngModel)]="curVal"
            style="width:400px;"
            [thyLabelRender]="renderTpl"
            [thyOptionRender]="optionTpl">
        </thy-cascader>
        <ng-template #renderTpl let-labels="labels" let-selectedOptions="selectedOptions">
            <ng-container>
                {{ isDisplay(labels) }}
                @for (label of labels; track $index; let i = $index; let isLast = $last) {
                    @if (!isLast) {
                        <span class="display-name-no-last">{{ label }} / </span>
                    }
                    @if (isLast) {
                        <span class="display-name-last">
                            {{ label }}
                            (
                            <a>
                                {{ selectedOptions[i].code }}
                            </a>
                            )
                        </span>
                    }
                }
            </ng-container>
        </ng-template>

        <ng-template #optionTpl let-option="option">
            <thy-icon class="option-icon mr-2" thyIconName="view-tile"></thy-icon>
            <span thyFlexibleText class="option-label-item" [thyTooltipContent]="option.label || ''"> {{ option.label || '' }}</span>
        </ng-template>
    `,
    imports: [FormsModule, CommonModule, OverlayModule, ThyCascaderModule, ThyFlexibleTextModule, ThyIconModule]
})
class CascaderTemplateComponent {
    public curVal: string | string[] = 'xihu';

    public thyCustomerOptions: any[] = clone(customerOptions);
    isDisplayName$ = new Subject<void>();
    constructor() {}

    isDisplay(labels: any[]) {
        this.isDisplayName$.next();
    }
}

@Component({
    selector: 'thy-test-cascader-multiple',
    template: `
        <thy-cascader
            [thyMultiple]="true"
            [thyShowSearch]="isShowSearch"
            [thyOptions]="multipleOptions"
            [thyCustomOptions]="customOptions"
            [thyIsOnlySelectLeaf]="isOnlySelectLeaf"
            [(ngModel)]="multipleVal"
            (ngModelChange)="selectChange($event)"
            [thyDisabled]="disabled"
            style="width:400px;">
        </thy-cascader>
    `,
    imports: [FormsModule, CommonModule, OverlayModule, ThyCascaderModule, ThyFlexibleTextModule, ThyIconModule]
})
class CascaderMultipleComponent {
    public multipleOptions: any[] = multipleOptions;

    public multipleVal: string[][] = [
        ['beijing', 'shixiaqu', 'haidianqu'],
        ['tianjinshi', 'shixiaqu', 'hepingqu']
    ];
    public selectSpy = jasmine.createSpy('multiple select option');

    public isShowSearch: boolean = false;

    public disabled = false;

    public customOptions: SafeAny[];

    public isOnlySelectLeaf = true;

    constructor() {}

    selectChange(e: string[]) {
        this.selectSpy(e);
    }

    public setCustomOptions() {
        const customOptions: SafeAny[] = [
            { label: '全部', value: 'all', children: [], isLeaf: true },
            { label: '自定义选项2', value: 'custom_option_1', children: [], isLeaf: true }
        ];
        this.customOptions = customOptions;
        return customOptions;
    }
}

@Component({
    selector: 'thy-test-cascader-custom-label-property',
    template: `
        <thy-cascader
            [thyMultiple]="true"
            [thyOptions]="multipleOptions"
            [thyCustomOptions]="customOptions"
            [thyLabelProperty]="'text'"
            [thyValueProperty]="'_id'"
            [thyIsOnlySelectLeaf]="isOnlySelectLeaf"
            [(ngModel)]="multipleVal"
            (ngModelChange)="selectChange($event)"
            [thyDisabled]="disabled"
            style="width:400px;">
        </thy-cascader>
    `,
    imports: [FormsModule, CommonModule, OverlayModule, ThyCascaderModule, ThyFlexibleTextModule, ThyIconModule]
})
class CascaderCustomLabelPropertyComponent {
    public multipleOptions: any[] = customLabelPropertyOptions;

    public multipleVal: string[][] = [['65518b58c012b3be15145d4d']];

    public selectSpy = jasmine.createSpy('multiple select option');

    public customOptions: SafeAny[] = [
        { text: '白天', _id: 'day', children: [], isLeaf: true },
        { text: '夜晚', _id: 'night', children: [], isLeaf: true }
    ];

    public isOnlySelectLeaf = true;

    constructor() {}

    selectChange(e: string[]) {
        this.selectSpy(e);
    }
}

describe('thy-cascader', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [ThyCascaderModule],
            providers: [provideHttpClient(), provideAnimations(), { provide: ComponentFixtureAutoDetect, useValue: true }]
        });
        TestBed.compileComponents();
    }));

    describe('base', () => {
        let fixture: ComponentFixture<CascaderBasicComponent>;
        let component: CascaderBasicComponent;
        let debugElement: DebugElement;
        let overlayContainer: OverlayContainer;
        let overlayContainerElement: HTMLElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(CascaderBasicComponent);
            component = fixture.componentRef.instance;
            debugElement = fixture.debugElement;
        });

        beforeEach(inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
            overlayContainer = oc;
            overlayContainerElement = oc.getContainerElement();
        }));

        afterEach(() => {
            overlayContainer.ngOnDestroy();
        });

        it('should create', () => {
            expect(fixture).toBeTruthy();
            expect(component).toBeTruthy();
        });

        it('should clear', async () => {
            component.curVal = 'zhejiang';
            fixture.detectChanges();
            await fixture.whenStable();
            component.changeValue$
                .pipe(take(1))
                .toPromise()
                .then(e => {
                    expect(e.length).toBe(0);
                });
            const el = debugElement.query(By.css('.select-control-clear'));
            dispatchFakeEvent(el.nativeElement, 'click', true);
            expect(el).toBeTruthy();
            fixture.detectChanges();
        });

        it('should change placeholder', () => {
            component.curVal = null;
            component.placeholder = 'test-change';
            const el = debugElement.query(By.css('.text-placeholder'));
            fixture.detectChanges();
            expect(el.nativeElement.innerText).toBe(component.placeholder);
        });

        it('should click open', () => {
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeTruthy();

            fixture.detectChanges();
            const menu = debugElement.query(By.css('.thy-cascader-menu')).nativeElement;
            expect(menu.classList.contains(component.columnClassName)).toBe(true);
        });

        it('should not click open when thyDisabled is true', fakeAsync(() => {
            component.disabled = true;
            fixture.detectChanges();
            const cascaderEle = debugElement.query(By.css(`.thy-cascader-picker`));
            expect(cascaderEle).toBeTruthy();

            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeFalsy();
        }));

        it('should select', done => {
            const selectedVal = ['zhejiang', 'hangzhou', 'xihu'];
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeTruthy();
            fixture.detectChanges();
            component.changeValue$.pipe(take(1)).subscribe(e => {
                expect(e).toEqual(selectedVal);
                done();
            });

            selectedVal.forEach(text => {
                const currentItem = debugElement.queryAll(By.css(`ul li`)).find(item => item.nativeElement.innerText.includes(text));
                dispatchFakeEvent(currentItem.nativeElement, 'click', true);
                fixture.detectChanges();
            });
        });

        it('should hover item', () => {
            component.curVal = null;
            component.thyExpandTriggerAction = 'hover';
            fixture.detectChanges();
            // component.curVal=['zhejiang','hangzhou'];
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeTruthy();
            fixture.detectChanges();
            expect(debugElement.queryAll(By.css(`ul li`)).length).toBe(customerOptions.length);
            const li = debugElement.query(By.css(`ul li`));
            dispatchFakeEvent(li.nativeElement, 'mouseover', true);

            fixture.detectChanges();
            expect(debugElement.queryAll(By.css(`ul li`)).length).toBe(customerOptions.length + 1);
        });

        it('should hover open', () => {
            component.thyTriggerAction = 'hover';
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'mouseenter', true);
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeTruthy();
        });

        it('should select one', done => {
            component.thyChangeOnSelect = true;
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeTruthy();
            fixture.detectChanges();
            component.changeValue$.pipe(take(1)).subscribe(value => {
                expect(value.length).toBe(1);
                done();
            });
            dispatchFakeEvent(debugElement.queryAll(By.css(`ul li`))[1].nativeElement, 'mouseover', true);
            dispatchFakeEvent(debugElement.queryAll(By.css(`ul li`))[1].nativeElement, 'click', true);
            fixture.detectChanges();
        });

        it('should select one when click radio and isOnlySelectLeaf is false', done => {
            component.thyChangeOnSelect = true;
            component.isOnlySelectLeaf = false;
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeTruthy();
            fixture.detectChanges();
            component.changeValue$.pipe(take(1)).subscribe(value => {
                expect(value.length).toBe(1);
                done();
            });
            debugElement.query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
        });

        it('should support thyHasBackdrop to be true', fakeAsync(() => {
            component.hasBackdrop = true;
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();
            expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeTruthy();
            const cascaderMenusElement = debugElement.query(By.css(`.thy-cascader-menus`));
            expect(cascaderMenusElement).toBeTruthy();
        }));

        it('should close menu when click document and thyHasBackdrop is false', fakeAsync(() => {
            component.hasBackdrop = false;
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();
            document.body.click();
            fixture.detectChanges();
            const cascaderMenusElement = debugElement.query(By.css(`.thy-cascader-menus`));
            expect(cascaderMenusElement).toBeFalsy();
        }));

        it('should menu mouse leave(hover)', () => {
            const spy = fixture.componentInstance.thyExpandStatusChange;
            component.thyTriggerAction = 'hover';
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'mouseenter', true);
            fixture.detectChanges();
            let el = debugElement.query(By.css('.thy-cascader-menus'));
            expect(el).toBeTruthy();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(true);
            dispatchFakeEvent(el.nativeElement, 'mouseleave', true);
            fixture.detectChanges();
            el = debugElement.query(By.css('.thy-cascader-menus'));
            expect(el).not.toBeTruthy();
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith(false);
        });

        it('should menu mouse leave(click)', () => {
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            let el = debugElement.query(By.css('.thy-cascader-menus'));
            expect(el).toBeTruthy();
            dispatchFakeEvent(el.nativeElement, 'mouseleave', true);
            fixture.detectChanges();
            el = debugElement.query(By.css('.thy-cascader-menus'));
            expect(el).toBeTruthy();
        });

        it('should have custom menu class', () => {
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            const el = debugElement.query(By.css('.test-menu-class'));
            expect(el).toBeTruthy();
        });

        it('should not error when options get by async way', fakeAsync(() => {
            const value = ['zhejiang', 'hangzhou', 'xihu'];
            fixture.componentInstance.curVal = value;
            fixture.componentInstance.thyCustomerOptions = [];
            fixture.detectChanges();
            flush();
            const displayEl = debugElement.query(By.css('.thy-cascader-picker-label'));
            expect(displayEl).toBeNull();

            fixture.componentInstance.setOptionsForAsync();
            fixture.detectChanges();
            tick(300);
            const newDisplayEl = debugElement.query(By.css('.thy-cascader-picker-label'));

            expect(newDisplayEl).not.toBeNull();
            const displayName = newDisplayEl.nativeElement.innerText;
            while (value.length > 0) {
                expect(displayName).toContain(value.pop());
            }
        }));

        it('should active selectedOptions when menu open', fakeAsync(() => {
            fixture.componentInstance.curVal = ['zhejiang', 'hangzhou', 'xihu'];
            fixture.detectChanges();
            flush();
            const trigger = debugElement.query(By.css('input')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            flush();
            const activatedOptions: NodeListOf<HTMLElement> = overlayContainerElement.querySelectorAll('.thy-cascader-menu-item-active');
            const activatedOptionsText: string[] = [];
            activatedOptions.forEach(item => activatedOptionsText.push(item.innerText.trim()));
            expect(activatedOptionsText).toEqual(fixture.componentInstance.curVal);
        }));

        it('should active selectedOptions when isMultiple is true and isOnlySelectLeaf is false', fakeAsync(() => {
            component.isMultiple = true;
            component.isOnlySelectLeaf = false;
            fixture.componentInstance.curVal = [
                ['tianjinshi', 'shixiaqu', 'hepingqu'],
                ['zhejiang', 'hangzhou']
            ] as SafeAny;
            fixture.detectChanges();
            const trigger = fixture.debugElement.query(By.css('input')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            tick(1000);
            const activatedOptions: NodeListOf<HTMLElement> = overlayContainerElement.querySelectorAll('.thy-cascader-menu-item-active');
            const activatedOptionsText: string[] = [];
            activatedOptions.forEach(item => activatedOptionsText.push(item.innerText.trim()));

            expect(activatedOptionsText).toEqual(fixture.componentInstance.curVal[fixture.componentInstance.curVal.length - 1]);
        }));

        it('should scroll to active item when menu open', fakeAsync(() => {
            fixture.componentInstance.thyCustomerOptions = multipleOptions;
            fixture.componentInstance.curVal = ['zhejiang', 'hangzhou', 'xihu'];
            fixture.detectChanges();
            flush();
            const trigger = debugElement.query(By.css('input')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            flush();
            const el = debugElement.query(By.css('.thy-cascader-menus')).nativeElement;
            el.style.height = 180;
            const elementRect = el.getBoundingClientRect();
            const activatedOption = overlayContainerElement.querySelector('.thy-cascader-menu-item-active').getBoundingClientRect();
            expect(activatedOption.top - elementRect.top < 180).toBeTruthy();
        }));

        it('should show empty state when options is []', fakeAsync(() => {
            component.thyCustomerOptions = [];
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            flush();
            const emptyContent = overlayContainerElement.querySelector('thy-empty') as HTMLElement;
            expect(emptyContent).toBeTruthy();
            const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
            expect(pane.style.minWidth).toEqual('122px');
        }));

        xit('should change height when the window is resized', fakeAsync(() => {
            const element = component.cascaderRef.trigger.nativeElement as Element;
            const getBoundingClientRect = spyOn(element, 'getBoundingClientRect');

            getBoundingClientRect.and.returnValues(
                {
                    height: 10,
                    width: 20,
                    top: 30,
                    left: 4
                },
                {
                    height: 50,
                    width: 60,
                    top: 70,
                    left: 80
                }
            );
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            const event = new Event('resize');
            window.dispatchEvent(event);
            fixture.detectChanges();
            tick(100);
            const triggerRect = component.cascaderRef.triggerRect;

            expect((triggerRect as DOMRect).height).toBe(50);
            expect((triggerRect as DOMRect).width).toBe(60);
        }));

        it('should show nothing when children is []', fakeAsync(() => {
            fixture.componentInstance.thyCustomerOptions = emptyOptions;
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            flush();
            const el = debugElement.query(By.css('.thy-cascader-menus'));
            const items = el.queryAll(By.css('.thy-cascader-menu-item'));
            const haveChildrenItem = items[0];
            const noChildrenItem = items[1];
            dispatchFakeEvent(haveChildrenItem.nativeElement, 'click', true);
            fixture.detectChanges();
            flush();
            const secondMenu = el.queryAll(By.css('.thy-cascader-menu'))[1];
            expect(secondMenu.children.length).toEqual(1);
            dispatchFakeEvent(noChildrenItem.nativeElement, 'click', true);
            fixture.detectChanges();
            flush();
            const emptySecondMenu = el.queryAll(By.css('.thy-cascader-menu'))[1];
            expect(emptySecondMenu.children.length).toEqual(0);
        }));

        it('should not selected option when children is [] and multiple is true and isOnlySelectLeaf is true', fakeAsync(() => {
            fixture.componentInstance.thyCustomerOptions = emptyOptions;
            fixture.componentInstance.isMultiple = true;
            fixture.componentInstance.isOnlySelectLeaf = true;
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            flush();
            fixture.detectChanges();

            const el = debugElement.query(By.css('.thy-cascader-menus'));
            const items = el.queryAll(By.css('.thy-cascader-menu-item'));
            const emptyIndex = emptyOptions.findIndex(item => item.children.length === 0);
            const emptyItem = items[emptyIndex];
            const checkedLabel = emptyItem.queryAll(By.css('.form-check-checked'));

            expect(checkedLabel.length).toEqual(0);
        }));

        it('should loadData by thyLoadData when thyLoadData is function', async () => {
            fixture.componentInstance.thyCustomerOptions = loadDataOption.root;
            fixture.componentInstance.loadData = (option: any) => {
                return new Promise<void>((res, rej) => {
                    if (option.label === 'zhejiang') {
                        option.children = loadDataOption.firstChildren;
                    }
                    res();
                });
            };
            fixture.detectChanges();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            await fixture.whenStable();
            const el = debugElement.query(By.css('.thy-cascader-menus'));
            const items = el.queryAll(By.css('.thy-cascader-menu-item'));
            const haveChildrenItem = items[0];
            const noChildrenItem = items[1];
            dispatchFakeEvent(haveChildrenItem.nativeElement, 'click', true);
            fixture.detectChanges();
            await fixture.whenStable();
            const secondMenu = el.queryAll(By.css('.thy-cascader-menu'))[1];
            expect(secondMenu.children.length).toEqual(1);
            dispatchFakeEvent(noChildrenItem.nativeElement, 'click', true);
            fixture.detectChanges();
            await fixture.whenStable();
            const emptySecondMenu = el.queryAll(By.css('.thy-cascader-menu'))[1];
            expect(emptySecondMenu.children.length).toEqual(0);
        });

        it('should only show one column when first opened', fakeAsync(() => {
            fixture.componentInstance.thyCustomerOptions = emptyOptions;
            fixture.detectChanges();
            fixture.componentInstance.curVal = ['anhui'];
            fixture.detectChanges();
            flush();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            flush();
            expect(component.cascaderRef.columns.length).toEqual(1);
        }));

        it('should call onFocus methods when focus', fakeAsync(() => {
            fixture.detectChanges();
            const focusSpy = spyOn<any>(fixture.componentInstance.cascader, 'onFocus').and.callThrough();
            const cascaderElement = fixture.debugElement.query(By.directive(ThyCascader)).nativeElement;
            dispatchFakeEvent(cascaderElement, 'focus');
            fixture.detectChanges();

            expect(focusSpy).toHaveBeenCalled();
        }));

        it('should call onBlur methods when blur', fakeAsync(() => {
            fixture.detectChanges();
            const blurSpy = spyOn<any>(fixture.componentInstance.cascader, 'onBlur').and.callThrough();
            const cascaderElement = fixture.debugElement.query(By.directive(ThyCascader)).nativeElement;
            dispatchFakeEvent(cascaderElement, 'blur');
            fixture.detectChanges();

            expect(blurSpy).toHaveBeenCalled();
        }));

        it('Should echo the value when the option is disabled', fakeAsync(() => {
            fixture.componentInstance.curVal = ['jiangsu', 'nanjing', 'zhonghuamen'];
            fixture.detectChanges();
            flush();
            const trigger = debugElement.query(By.css('input')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            flush();
            const activatedOptions: NodeListOf<HTMLElement> = overlayContainerElement.querySelectorAll('.thy-cascader-menu-item-disabled');
            expect(activatedOptions.length).toEqual(fixture.componentInstance.curVal.length);
            const activatedOptionsText: string[] = [];
            activatedOptions.forEach(item => activatedOptionsText.push(item.innerText.trim()));
            expect(activatedOptionsText).toEqual(fixture.componentInstance.curVal);
        }));

        it('should hide checkbox and radio when the option is readonly', () => {
            fixture.componentInstance.isMultiple = true;
            fixture.componentInstance.isOnlySelectLeaf = true;
            fixture.detectChanges();
            const trigger = debugElement.query(By.css('input')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            const checkboxes = fixture.debugElement.query(By.css('.thy-cascader-menu')).queryAll(By.css('.thy-checkbox'));
            expect(checkboxes.length).toEqual(customerOptions.length - 1);
        });

        it('should not change EXPANDED_DROPDOWN_POSITIONS when cdkConnectedOverlayPositions is changed', () => {
            expect(EXPANDED_DROPDOWN_POSITIONS).not.toEqual((component.cascader as SafeAny).cascaderPosition);
        });

        it('should show thy-input-search when set thyShowSearch', fakeAsync(() => {
            expect(fixture.componentInstance.cascaderRef.thyShowSearch).toBe(false);

            fixture.componentInstance.isShowSearch = true;
            const trigger = fixture.debugElement.query(By.css('.form-control-custom')).nativeElement;
            trigger.click();
            fixture.detectChanges();

            expect(fixture.componentInstance.cascaderRef.thyShowSearch).toBe(true);
            expect(fixture.debugElement.query(By.css('.search-input-field'))).not.toBeNull();
        }));

        it('should searched some options', fakeAsync(() => {
            fixture.componentInstance.isShowSearch = true;
            const trigger = fixture.debugElement.query(By.css('.form-control-custom')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            const input = fixture.debugElement.query(By.css('.search-input-field')).nativeElement;
            typeInElement('xihu', input);
            fixture.detectChanges();
            tick(300);
            fixture.detectChanges();

            expect(overlayContainerElement.querySelector('.thy-cascader-search-list')).toBeTruthy();
            const allSearchList = overlayContainerElement.querySelectorAll('.thy-cascader-search-list-item');
            expect(allSearchList.length).toBeGreaterThan(0);
            allSearchList.forEach(item => {
                expect((item as HTMLElement).innerText).toMatch('xihu');
                const optionLabel = (item as HTMLElement).querySelector('.option-label-item');
                expect(optionLabel.classList.contains('text-truncate')).toBeTruthy();
                expect(optionLabel.classList.contains('flexible-text-container')).toBeTruthy();
            });
        }));

        it('should searched some options that is parent when isOnlySelectLeaf is false', fakeAsync(() => {
            component.isOnlySelectLeaf = false;
            fixture.componentInstance.isShowSearch = true;
            fixture.detectChanges();

            const trigger = fixture.debugElement.query(By.css('.form-control-custom')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            const input = fixture.debugElement.query(By.css('.search-input-field')).nativeElement;
            typeInElement('zhejiang', input);
            fixture.detectChanges();
            tick(300);
            fixture.detectChanges();

            expect(overlayContainerElement.querySelector('.thy-cascader-search-list')).toBeTruthy();
            const allSearchList = overlayContainerElement.querySelectorAll('.thy-cascader-search-list-item');
            expect(allSearchList.length).toBeGreaterThan(0);
            allSearchList.forEach(item => {
                expect((item as HTMLElement).innerText).toMatch('zhejiang');
                const optionLabel = (item as HTMLElement).querySelector('.option-label-item');
                expect(optionLabel.classList.contains('text-truncate')).toBeTruthy();
                expect(optionLabel.classList.contains('flexible-text-container')).toBeTruthy();
            });
        }));

        it('should not searched node that children is empty but not leaf', fakeAsync(() => {
            fixture.componentInstance.isShowSearch = true;
            const options = fixture.componentInstance.thyCustomerOptions;
            options.push({
                value: 'shandong',
                label: 'shandong',
                code: 37,
                children: []
            });

            fixture.componentInstance.thyCustomerOptions = options;
            fixture.detectChanges();
            const trigger = fixture.debugElement.query(By.css('.form-control-custom')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            const input = fixture.debugElement.query(By.css('.search-input-field')).nativeElement;
            typeInElement('shandong', input);
            fixture.detectChanges();
            tick(300);
            fixture.detectChanges();
            flush();
            const emptyNode = overlayContainerElement.querySelector('thy-empty') as HTMLElement;
            expect(emptyNode).toBeTruthy();
            expect(emptyNode.textContent).toContain(fixture.componentInstance.emptyStateText);
        }));

        it('should show empty when do not match any option', fakeAsync(() => {
            fixture.componentInstance.isShowSearch = true;
            fixture.componentInstance.emptyStateText = 'Not Search Result';
            const trigger = fixture.debugElement.query(By.css('.form-control-custom')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            const input = fixture.debugElement.query(By.css('.search-input-field')).nativeElement;
            typeInElement('NotCityName', input);
            tick(300);
            fixture.detectChanges();
            flush();

            const emptyNode = overlayContainerElement.querySelector('thy-empty') as HTMLElement;
            expect(emptyNode).toBeTruthy();
            expect(emptyNode.textContent).toContain(fixture.componentInstance.emptyStateText);
        }));

        it('should update value after click search option', fakeAsync(() => {
            fixture.componentInstance.isShowSearch = true;
            const trigger = fixture.debugElement.query(By.css('.form-control-custom')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            const input = fixture.debugElement.query(By.css('.search-input-field')).nativeElement;
            typeInElement('xihu', input);
            fixture.detectChanges();
            tick(300);
            fixture.detectChanges();
            const searchOption = overlayContainerElement.querySelector('.thy-cascader-search-list-item');
            let text: string[] = [];
            (searchOption as HTMLElement).querySelectorAll('.thy-breadcrumb-item').forEach(item => {
                text.push((item as HTMLElement).innerText);
            });
            let options = fixture.componentInstance.thyCustomerOptions;
            let selectedValue: string[] = [];
            while (text.length) {
                const curText = text.shift();
                const curOption = options.find(item => item.label === curText);
                selectedValue.push(curOption.value);
                options = curOption.children;
            }
            component.changeValue$.pipe(take(1)).subscribe(e => {
                expect(e).toEqual(selectedValue);
            });

            dispatchFakeEvent(searchOption, 'click');
            fixture.detectChanges();
            tick(300);
            fixture.detectChanges();
            flush();
        }));

        it('should show custom options', done => {
            component.thyChangeOnSelect = true;
            component.isOnlySelectLeaf = false;
            const customOpts = component.setCustomOptions();
            fixture.detectChanges();

            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            const elements = debugElement.queryAll(By.css(`.thy-cascader-menu-item`));
            expect(elements[0].nativeElement.innerText).toEqual(customOpts[0].label);
            expect(elements[1].nativeElement.innerText).toEqual(customOpts[1].label);

            const dividerEl = debugElement.query(By.css(`.thy-divider-horizontal`));
            expect(dividerEl).toBeTruthy();

            component.changeValue$.pipe(take(1)).subscribe(value => {
                expect(value.length).toBe(1);
                expect(value[0]).toEqual(customOpts[0].value);
                done();
            });
            debugElement.query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
        });

        it('should update selected after click custom option', done => {
            const clickIdx = 1;
            component.thyChangeOnSelect = true;
            const customOpts = component.setCustomOptions();
            fixture.detectChanges();

            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            const elements = debugElement.queryAll(By.css(`.thy-cascader-menu-item`));
            expect(elements[0].nativeElement.innerText).toEqual(customOpts[0].label);
            expect(elements[1].nativeElement.innerText).toEqual(customOpts[1].label);
            const dividerEl = debugElement.query(By.css(`.thy-divider-horizontal`));
            expect(dividerEl).toBeTruthy();

            component.changeValue$.pipe(take(1)).subscribe(value => {
                expect(value.length).toBe(1);
                expect(value[0]).toEqual(customOpts[clickIdx].value);
                done();
            });
            debugElement.queryAll(By.css('.thy-cascader-menu-item'))[clickIdx].nativeElement.click();
            fixture.detectChanges();
        });
    });

    describe('loadData', () => {
        let fixture: ComponentFixture<CascaderLoadComponent>;
        let component: CascaderLoadComponent;
        let debugElement: DebugElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(CascaderLoadComponent);
            component = fixture.componentRef.instance;
            debugElement = fixture.debugElement;
        });

        it('should load data', async () => {
            component.success = true;
            fixture.detectChanges();
            await fixture.whenStable();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeTruthy();
            await fixture.whenStable();
            expect(debugElement.queryAll(By.css(`ul li`)).length).toBeGreaterThan(0);
        });

        it('should load data error', async () => {
            component.success = false;
            fixture.detectChanges();
            await fixture.whenStable();
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            fixture.detectChanges();
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeTruthy();
            await fixture.whenStable();
            expect(debugElement.queryAll(By.css(`ul li`)).length).toBe(0);
        });
    });

    describe('template', () => {
        let fixture: ComponentFixture<CascaderTemplateComponent>;
        let component: CascaderTemplateComponent;
        let debugElement: DebugElement;
        let overlayContainer: OverlayContainer;
        let overlayContainerElement: HTMLElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(CascaderTemplateComponent);
            component = fixture.componentRef.instance;
            debugElement = fixture.debugElement;
        });

        beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
            overlayContainer = oc;
            overlayContainerElement = oc.getContainerElement();
        }));

        afterEach(() => {
            overlayContainer.ngOnDestroy();
        });

        it('should create', () => {
            expect(fixture).toBeTruthy();
            expect(component).toBeTruthy();
        });

        it('should display custom label', done => {
            fixture.detectChanges();
            component.isDisplayName$
                .pipe(take(1))
                .toPromise()
                .then(() => {
                    const el = debugElement.query(By.css('.thy-cascader-picker-label .display-name-last'));
                    expect(el).toBeTruthy();
                    done();
                });
        });

        it('should display custom label multi', done => {
            component.curVal = ['zhejiang', 'hangzhou', 'xihu'];
            fixture.detectChanges();

            component.isDisplayName$
                .pipe(take(1))
                .toPromise()
                .then(() => {
                    expect(debugElement.queryAll(By.css('.thy-cascader-picker-label .display-name-last')).length === 1).toBeTruthy();
                    expect(debugElement.queryAll(By.css('.thy-cascader-picker-label .display-name-no-last')).length === 2).toBeTruthy();
                    done();
                });
        });

        it('should display custom option', () => {
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);

            fixture.detectChanges();
            const customIcon = debugElement.query(By.css('.option-icon'));
            expect(customIcon).toBeTruthy();
        });

        it('should display custom search option', fakeAsync(() => {
            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);

            fixture.detectChanges();
            const input = fixture.debugElement.query(By.css('.search-input-field')).nativeElement;
            typeInElement('xihu', input);
            fixture.detectChanges();
            tick(300);
            fixture.detectChanges();

            const customIcon = debugElement.query(By.css('.option-icon'));
            expect(customIcon).toBeTruthy();
        }));
    });

    describe('multiple mode', () => {
        let fixture: ComponentFixture<CascaderMultipleComponent>;
        let component: CascaderMultipleComponent;
        let debugElement: DebugElement;
        let overlayContainer: OverlayContainer;
        let overlayContainerElement: HTMLElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(CascaderMultipleComponent);
            component = fixture.componentRef.instance;
            debugElement = fixture.debugElement;
        });

        beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
            overlayContainer = oc;
            overlayContainerElement = oc.getContainerElement();
        }));

        afterEach(() => {
            overlayContainer.ngOnDestroy();
        });

        it('should create', () => {
            expect(fixture).toBeDefined();
            expect(component).toBeDefined();
        });

        it('should show multiple selected label', async () => {
            await fixture.whenStable();
            const labels = debugElement.queryAll(By.css('.choice-item'));
            const selectedValue = component.multipleVal;
            expect(labels.length).toBe(selectedValue.length);
        });

        it('should not click open when thyDisabled or disabled is true', fakeAsync(() => {
            component.disabled = true;
            fixture.detectChanges();
            const cascaderEle = debugElement.query(By.css(`.thy-cascader-picker`));
            expect(cascaderEle).toBeTruthy();

            dispatchFakeEvent(debugElement.query(By.css('input')).nativeElement, 'click', true);
            const el = debugElement.query(By.css(`.thy-cascader-picker-open`));
            expect(el).toBeFalsy();
        }));

        it('should add item when click', async () => {
            await fixture.whenStable();
            const originSelectedCount = component.multipleVal?.length;
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();

            const firstLevelItem = getOptionByLevel();
            dispatchFakeEvent(firstLevelItem[2].nativeElement, 'click');
            fixture.detectChanges();

            const sectionLevelItem = getOptionByLevel(1)[0];
            dispatchFakeEvent(sectionLevelItem.nativeElement, 'click');
            fixture.detectChanges();

            const thirdLevelItem = getOptionByLevel(2)[0];
            thirdLevelItem.query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectSpy).toHaveBeenCalled();
            expect(component.multipleVal.length).toBe(originSelectedCount + 1);
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(component.multipleVal.length);
        });

        it('should selection all leafs when click parent node', async () => {
            component.multipleVal = [
                ['beijing', 'shixiaqu', 'haidianqu'],
                ['tianjinshi', 'shixiaqu', 'hepingqu'],
                ['jilinsheng', 'liaoyuanshi', 'longshanqu']
            ];
            fixture.detectChanges();
            await fixture.whenStable();
            const originSelectedCount = component.multipleVal?.length;
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();

            const firstLevelItem = getOptionByLevel();
            dispatchFakeEvent(firstLevelItem[2].nativeElement, 'click');
            fixture.detectChanges();

            const sectionLevelItem = getOptionByLevel(1)[0];
            dispatchFakeEvent(sectionLevelItem.nativeElement, 'click');
            sectionLevelItem.query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectSpy).toHaveBeenCalled();
            expect(component.multipleVal.length).toBe(originSelectedCount + 3);
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(component.multipleVal.length);
        });

        it('should remove item when click x', async () => {
            await fixture.whenStable();
            const originSelectedCount = component.multipleVal?.length;
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();

            dispatchFakeEvent(debugElement.query(By.css('.thy-icon-close')).nativeElement, 'click', true);
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.multipleVal.length).toBe(originSelectedCount - 1);
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(component.multipleVal.length);
        });

        it('should clear item when click clear btn', async () => {
            await fixture.whenStable();
            const originSelectedCount = component.multipleVal?.length;
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();
            const firstLevelItem = getOptionByLevel();
            const originFirstLevelItemLength = firstLevelItem.length;
            dispatchFakeEvent(firstLevelItem[0].nativeElement, 'click');
            fixture.detectChanges();

            const sectionLevelItem = getOptionByLevel(1)[0];
            dispatchFakeEvent(sectionLevelItem.nativeElement, 'click');
            fixture.detectChanges();

            const thirdLevelItem = getOptionByLevel(2)[0];
            thirdLevelItem.query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.multipleVal.length).toBe(originSelectedCount - 1);
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(component.multipleVal.length);

            const updateFirstLevelItem = getOptionByLevel();
            expect(originFirstLevelItemLength).toBe(updateFirstLevelItem.length);
        });

        it('should show nothing when ngModel is []', fakeAsync(() => {
            component.multipleVal = [];
            fixture.detectChanges();
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(0);
        }));

        it('should show selected value in form-control when options is disabled', async () => {
            component.multipleOptions = setDisabledOptions(component.multipleVal);
            fixture.detectChanges();
            await fixture.whenStable();
            const originSelectedCount = component.multipleVal?.length;
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(originSelectedCount);
        });

        it('should show disabled options when some options is disabled', async () => {
            component.multipleOptions = setDisabledOptions(component.multipleVal);

            fixture.detectChanges();
            await fixture.whenStable();
            const originSelected = component.multipleVal;

            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();
            const showedOptions: NodeListOf<HTMLElement> = overlayContainerElement.querySelectorAll('.thy-cascader-menu-item-disabled');
            // The number of displayed disabled items should be equal to the selected number plus the number of the last selected items
            // minus the repeated calculation
            expect(showedOptions.length).toEqual(originSelected.length + originSelected[originSelected.length - 1].length - 1);
            // disabled item text is selectedValue
            const allShowedOptionsText = Array.from(showedOptions).map(item => item.innerText);
            const expectedText = [...originSelected[originSelected.length - 1], ...originSelected.map(item => item[0])];
            expectedText.forEach(selected => {
                expect(allShowedOptionsText.includes(selected));
            });
        });

        it('should show disabled options when hover/click disabled option', async () => {
            component.multipleOptions = setDisabledOptions(component.multipleVal);

            fixture.detectChanges();
            await fixture.whenStable();
            const originSelected = component.multipleVal;

            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();
            const firstLevelItem = getOptionByLevel();
            const firstDisabledItem = firstLevelItem.find(item =>
                (item.nativeElement as HTMLElement).innerText.includes(originSelected[0][0])
            );
            dispatchFakeEvent(firstDisabledItem.nativeElement, 'click');
            fixture.detectChanges();

            const sectionLevelItem = getOptionByLevel(1)[0];
            dispatchFakeEvent(sectionLevelItem.nativeElement, 'click');
            fixture.detectChanges();

            const showedOptions: NodeListOf<HTMLElement> = overlayContainerElement.querySelectorAll('.thy-cascader-menu-item-disabled');
            // The number of displayed disabled items should be equal to the selected number plus the number of the last selected items
            // minus the repeated calculation
            expect(showedOptions.length).toEqual(originSelected.length + originSelected[0].length - 1);
            const allShowedOptionsText = Array.from(showedOptions).map(item => item.innerText);
            const expectedText = [...originSelected[0], ...originSelected.map(item => item[0])];
            expectedText.forEach(selected => {
                expect(allShowedOptionsText.includes(selected));
            });
        });

        it('should do nothing after click activated option', fakeAsync(() => {
            fixture.componentInstance.isShowSearch = true;

            const trigger = fixture.debugElement.query(By.css('.form-control-custom')).nativeElement;
            trigger.click();
            fixture.detectChanges();
            const input = fixture.debugElement.query(By.css('.search-input-field')).nativeElement;

            typeInElement('haidianqu', input);
            fixture.detectChanges();
            tick(300);
            fixture.detectChanges();

            const searchOptionCheckbox = overlayContainerElement.querySelector('.thy-checkbox');
            expect(searchOptionCheckbox).toBeTruthy();
            flush();
            fixture.detectChanges();
            expect(searchOptionCheckbox.classList).toContain('form-check-checked');
            dispatchFakeEvent(searchOptionCheckbox, 'click');
            flush();
            fixture.detectChanges();
            expect(searchOptionCheckbox.classList).toContain('form-check-checked');
        }));

        it('should show custom options in multi mode', async () => {
            const clickIdx = 0;
            component.isOnlySelectLeaf = false;
            const customOpts = component.setCustomOptions();
            fixture.detectChanges();
            await fixture.whenStable();

            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();
            const firstLevelItem = getOptionByLevel();
            for (let i = 0; i < customOpts.length; i++) {
                expect(firstLevelItem[i].nativeElement.innerText).toEqual(customOpts[i].label);
            }
            const dividerEl = debugElement.query(By.css(`.thy-divider-horizontal`));
            expect(dividerEl).toBeTruthy();

            firstLevelItem[clickIdx].query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectSpy).toHaveBeenCalled();
            expect(component.multipleVal.length).toBe(1);
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(component.multipleVal.length);
            expect(labels[0].nativeElement.innerText).toEqual(customOpts[clickIdx].label);

            firstLevelItem[customOpts.length].query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.multipleVal.length).toBe(1);
            const updateLabels = debugElement.queryAll(By.css('.choice-item'));
            expect(updateLabels.length).toBe(component.multipleVal.length);
            expect(updateLabels[0].nativeElement.innerText).not.toEqual(customOpts[clickIdx].label);
            expect(updateLabels[0].nativeElement.innerText).toEqual(multipleOptions[0].label);
        });

        it('should show custom selected when init value is custom option', async () => {
            const originSelected = 'all';
            component.isOnlySelectLeaf = true;
            const customOpts = component.setCustomOptions();
            component.multipleVal = [[originSelected]];
            fixture.detectChanges();
            await fixture.whenStable();
            const showLabels = debugElement.queryAll(By.css('.choice-item'));
            expect(showLabels.length).toBe(component.multipleVal.length);
            expect(showLabels[0].nativeElement.innerText).toEqual(customOpts.find(item => item.value === originSelected).label);
        });

        it('should clear other selected after click custom option', async () => {
            const clickIdx = 1;
            component.isOnlySelectLeaf = true;
            const customOpts = component.setCustomOptions();
            fixture.detectChanges();
            await fixture.whenStable();
            const showLabels = debugElement.queryAll(By.css('.choice-item'));
            expect(showLabels.length).toBe(component.multipleVal.length);
            expect(showLabels[0].nativeElement.innerText).toContain(multipleOptions[0].label);

            fixture.detectChanges();
            await fixture.whenStable();
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();

            const firstLevelItem = getOptionByLevel();
            firstLevelItem[clickIdx].query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectSpy).toHaveBeenCalled();
            expect(component.multipleVal.length).toBe(1);
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(component.multipleVal.length);
            expect(labels[0].nativeElement.innerText).toEqual(customOpts[clickIdx].label);

            dispatchFakeEvent(firstLevelItem[customOpts.length].nativeElement, 'click');
            fixture.detectChanges();
            const sectionLevelItem = getOptionByLevel(1)[0];
            dispatchFakeEvent(sectionLevelItem.nativeElement, 'click');
            fixture.detectChanges();
            const thirdLevelItem = getOptionByLevel(2)[0];
            thirdLevelItem.query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectSpy).toHaveBeenCalled();
            expect(component.multipleVal.length).toBe(1);
            const updatedLabels = debugElement.queryAll(By.css('.choice-item'));
            expect(updatedLabels.length).toBe(component.multipleVal.length);
            const expectText = `${multipleOptions[0].label} / ${multipleOptions[0].children[0].label} / ${multipleOptions[0].children[0].children[0].label}`;
            expect(showLabels[0].nativeElement.innerText).toEqual(expectText);
        });

        it('should not show divider when not set thyCustomOptions property', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();
            const levelUlList = debugElement.queryAll(By.css('.thy-cascader-menu'))[0];
            const divider = levelUlList.query(By.css('thy-divider'));
            expect(divider).toBe(null);
        });

        function getOptionByLevel(level: number = 0) {
            const levelUlList = debugElement.queryAll(By.css('.thy-cascader-menu'))[level];
            const levelLi = levelUlList.queryAll(By.css('li'));
            return levelLi;
        }

        /**
         * set selected value options is disabled
         */
        function setDisabledOptions(selectedVal: any[]) {
            return multipleOptions.map((area: any) => {
                const copyArea = { ...area };
                if (selectedVal.map(item => item[0]).includes(copyArea.value)) {
                    copyArea.disabled = true;
                    copyArea.children = copyArea.children
                        .filter((item: any) => {
                            if (selectedVal.map(item => item[1]).includes(item.value)) {
                                return true;
                            }
                        })
                        .map((item: any) => {
                            const copyItem = { ...item };
                            if (selectedVal.map(item => item[1]).includes(copyItem.value)) {
                                copyItem.disabled = true;
                                copyItem.children = copyItem.children
                                    .filter((data: any) => {
                                        if (selectedVal.map(item => item[2]).includes(data.value)) {
                                            return true;
                                        }
                                    })
                                    .map((data: any) => {
                                        const copyData = { ...data };
                                        if (selectedVal.map(item => item[2]).includes(copyData.value)) {
                                            copyData.disabled = true;
                                        }
                                        return copyData;
                                    });
                            }
                            return copyItem;
                        });
                }
                return copyArea;
            });
        }
    });

    describe('custom label property and custom value property', () => {
        let fixture: ComponentFixture<CascaderCustomLabelPropertyComponent>;
        let component: CascaderCustomLabelPropertyComponent;
        let debugElement: DebugElement;
        let overlayContainer: OverlayContainer;
        let overlayContainerElement: HTMLElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(CascaderCustomLabelPropertyComponent);
            component = fixture.componentRef.instance;
            debugElement = fixture.debugElement;
        });

        beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
            overlayContainer = oc;
            overlayContainerElement = oc.getContainerElement();
        }));

        afterEach(() => {
            overlayContainer.ngOnDestroy();
        });

        it('should show multiple selected label', async () => {
            await fixture.whenStable();
            const labels = debugElement.queryAll(By.css('.choice-item'));
            const selectedValue = component.multipleVal;
            expect(labels.length).toBe(selectedValue.length);
        });

        it('should show right text when set custom label property and value property', async () => {
            const clickIdx = 0;
            const labelProperty = 'text';
            fixture.detectChanges();
            await fixture.whenStable();
            const showLabels = debugElement.queryAll(By.css('.choice-item'));
            expect(showLabels.length).toBe(component.multipleVal.length);
            expect(showLabels[0].nativeElement.innerText).toContain(customLabelPropertyOptions[0][labelProperty]);

            fixture.detectChanges();
            await fixture.whenStable();
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();

            const levelUlList = debugElement.queryAll(By.css('.thy-cascader-menu'))[0];
            const divider = levelUlList.query(By.css('thy-divider'));
            expect(divider).not.toBe(null);

            const firstLevelItem = getOptionByLevel();
            firstLevelItem[clickIdx].query(By.css('label')).nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectSpy).toHaveBeenCalled();
            expect(component.multipleVal.length).toBe(1);
            const labels = debugElement.queryAll(By.css('.choice-item'));
            expect(labels.length).toBe(component.multipleVal.length);
            expect(labels[0].nativeElement.innerText).toEqual(component.customOptions[clickIdx][labelProperty]);
        });

        it('should not show divider when set thyCustomOptions property to undefined', async () => {
            component.customOptions = undefined;
            fixture.detectChanges();
            await fixture.whenStable();
            dispatchFakeEvent(debugElement.query(By.css('.form-control')).nativeElement, 'click', true);
            fixture.detectChanges();
            const levelUlList = debugElement.queryAll(By.css('.thy-cascader-menu'))[0];
            const divider = levelUlList.query(By.css('thy-divider'));
            expect(divider).toBe(null);
        });

        function getOptionByLevel(level: number = 0) {
            const levelUlList = debugElement.queryAll(By.css('.thy-cascader-menu'))[level];
            const levelLi = levelUlList.queryAll(By.css('li'));
            return levelLi;
        }
    });
});
