import {
    Component,
    forwardRef,
    HostBinding,
    Input,
    ElementRef,
    OnInit,
    ContentChildren,
    QueryList,
    Output,
    EventEmitter,
    TemplateRef,
    ContentChild,
    ViewChild,
    Renderer2,
    OnDestroy,
    ChangeDetectorRef,
    InjectionToken,
    Inject
} from '@angular/core';
import { UpdateHostClassService } from '../shared/update-host-class.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
    ThyOptionComponent,
    THY_SELECT_OPTION_PARENT_COMPONENT,
    IThySelectOptionParentComponent
} from './option.component';
import { ThyPositioningService } from '../positioning/positioning.service';
import { inputValueToBoolean, isArray } from '../util/helpers';
import {
    ScrollStrategy,
    Overlay,
    ViewportRuler,
    ConnectionPositionPair,
    ConnectedOverlayPositionChange
} from '@angular/cdk/overlay';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EXPANDED_DROPDOWN_POSITIONS } from '../core/overlay/overlay-opsition-map';
import { ThySelectOptionGroupComponent } from './option-group.component';
import { SelectionModel } from '@angular/cdk/collections';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | '';

export type SelectMode = 'multiple' | '';

export interface OptionValue {
    thyLabelText?: string;
    thyValue?: string;
    thyDisabled?: boolean;
    thyShowOptionCustom?: boolean;
    thySearchKey?: string;
}

const noop = () => {};

@Component({
    selector: 'thy-custom-select',
    templateUrl: './select-custom.component.html',
    providers: [
        {
            provide: THY_SELECT_OPTION_PARENT_COMPONENT,
            useExisting: ThySelectCustomComponent
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ThySelectCustomComponent),
            multi: true
        },
        UpdateHostClassService
    ]
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThySelectCustomComponent
    implements ControlValueAccessor, IThySelectOptionParentComponent, OnInit, OnDestroy {
    searchText: string;

    _disabled = false;

    _size: InputSize;

    _mode: SelectMode;

    _emptyStateText: string;

    _classNames: any = [];

    _viewContentInitialized = false;

    _loadingDone = true;

    _scrollStrategy: ScrollStrategy;

    _modalValue: any;

    public dropDownPosition = 'bottom';

    selectionModel: SelectionModel<ThyOptionComponent>;

    positions: ConnectionPositionPair[] = EXPANDED_DROPDOWN_POSITIONS;

    /** The last measured value for the trigger's client bounding rect. */
    triggerRect: ClientRect;

    /** Emits whenever the component is destroyed. */
    private readonly _destroy$ = new Subject<void>();

    private onTouchedCallback: () => void = noop;

    private onChangeCallback: (_: any) => void = noop;

    @HostBinding('class.thy-select-custom') _isSelectCustom = true;

    @HostBinding('class.thy-select') _isSelect = true;

    // 下拉选项是否展示
    @HostBinding('class.menu-is-opened') _panelOpen = false;

    @Output() thyOnSearch: EventEmitter<any> = new EventEmitter<any>();

    @Input() thyShowSearch: boolean;

    @Input() thyPlaceHolder: string;

    @Input() thyServerSearch: boolean;

    @Input() thyShowOptionMenu: boolean;

    @Input()
    set thyMode(value: SelectMode) {
        this._mode = value;
    }

    @Input()
    set thySize(value: InputSize) {
        this._size = value;
    }

    @Input()
    set thyEmptyStateText(value: string) {
        this._emptyStateText = value;
    }

    @Input() thyAllowClear = false;

    @Input()
    set thyLoadingDone(value: boolean) {
        this._loadingDone = inputValueToBoolean(value);
    }

    @Input()
    set thyDisabled(value: string) {
        this._disabled = inputValueToBoolean(value);
    }

    @ContentChild('selectedDisplay') selectedValueDisplayRef: TemplateRef<any>;

    @ViewChild('trigger') trigger: ElementRef<any>;

    selectedDisplayContext: any;

    @ContentChildren(ThyOptionComponent, { descendants: true }) options: QueryList<ThyOptionComponent>;

    @ContentChildren(ThySelectOptionGroupComponent) optionGroups: QueryList<ThySelectOptionGroupComponent>;

    constructor(
        private elementRef: ElementRef,
        private updateHostClassService: UpdateHostClassService,
        private renderer: Renderer2,
        private overlay: Overlay,
        private viewportRuler: ViewportRuler,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.updateHostClassService.initializeElement(elementRef.nativeElement);
    }

    ngOnInit() {
        this._scrollStrategy = this.overlay.scrollStrategies.reposition();
        this.viewportRuler
            .change()
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                if (this._panelOpen) {
                    this.triggerRect = this.trigger.nativeElement.getBoundingClientRect();
                    this.changeDetectorRef.markForCheck();
                }
            });
        this._instanceSelectionModel();
        if (this._modalValue) {
            this._resetSelectedOption(this._modalValue);
            this._setSelectedValueContext();
        }
        if (this._size) {
            this._classNames.push(`thy-select-${this._size}`);
        }
        if (this._mode === 'multiple') {
            this._classNames.push(`thy-select-custom--multiple`);
        }
        this.updateHostClassService.updateClass(this._classNames);
    }

    // ngAfterViewInit(): void {
    //     // this._viewContentInitialized = true;
    //     // this._setSelectedOptions();
    // }

    // ngAfterContentInit(): void {
    //     // this._viewContentInitialized = true;
    //     // this._setSelectedOptions();
    // }

    writeValue(value: any): void {
        this._modalValue = value;
        if (this.options && this.options.length > 0) {
            this._resetSelectedOption(this._modalValue);
            this._setSelectedValueContext();
        }
        // } else {
        //     // this._innerValue = value;
        // }
        // if (this._viewContentInitialized) {
        //     this._setSelectedOptions();
        // }
    }

    get panelOpen(): boolean {
        return this._panelOpen;
    }

    _resetSelectedOption(modalValue: any) {
        this.selectionModel.clear();
        if (!modalValue) {
            return;
        }
        if (this._mode === 'multiple') {
            if (isArray(modalValue)) {
                this.options.forEach(option => {
                    const index = (modalValue as Array<any>).findIndex(itemValue => {
                        return itemValue === option.thyValue;
                    });
                    if (index >= 0) {
                        this.selectionModel.select(option);
                    }
                });
            }
        } else {
            const selectedOption = this.options.find(option => {
                return option.thyValue === modalValue;
            });
            this.selectionModel.select(selectedOption);
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    // valueOnChange(value: any) {
    //     this.onChangeCallback(value);
    // }

    private _emitModelValueChange() {
        if (this.options.length > 0) {
            const selectedValues = this.selectionModel.selected;
            const changeValue = selectedValues.map((option: ThyOptionComponent) => {
                return option.thyValue;
            });
            if (this._mode === 'multiple') {
                this.onChangeCallback(changeValue);
            } else {
                if (changeValue.length === 0) {
                    this.onChangeCallback(null);
                } else {
                    this.onChangeCallback(changeValue[0]);
                }
            }
        }
    }

    private _setSelectedValueContext() {
        const selectedValues = this.selectionModel.selected;
        if (selectedValues.length === 0) {
            this.selectedDisplayContext = null;
            return;
        }
        const context = selectedValues.map((option: ThyOptionComponent) => {
            return option.thyRawValue || option.thyValue;
        });
        if (this._mode === 'multiple') {
            this.selectedDisplayContext = {
                $implicit: context
            };
        } else {
            this.selectedDisplayContext = {
                $implicit: context[0]
            };
        }
    }

    remove(event: Event, item: ThyOptionComponent, index: number) {
        event.stopPropagation();
        this.toggleOption(item);
    }

    clearSelectValue(event: Event) {
        event.stopPropagation();
        this.selectionModel.clear();
        this._emitModelValueChange();
        this._setSelectedValueContext();
    }

    /** Toggles the overlay panel open or closed. */
    toggle(): void {
        this._panelOpen ? this.close() : this.open();
    }

    open(): void {
        if (this._disabled || !this.options || !this.options.length || this._panelOpen) {
            return;
        }
        this.triggerRect = this.trigger.nativeElement.getBoundingClientRect();
        this._panelOpen = true;
    }

    /** Closes the overlay panel and focuses the host element. */
    close(): void {
        if (this._panelOpen) {
            this._panelOpen = false;
            this.changeDetectorRef.markForCheck();
        }
    }

    onSearchFilter() {}

    private _instanceSelectionModel() {
        this.selectionModel = new SelectionModel<ThyOptionComponent>(this._mode === 'multiple');
    }

    toggleOption(option: ThyOptionComponent, event?: Event) {
        if (option && !option.thyDisabled) {
            this.selectionModel.toggle(option);
            if (this._mode !== 'multiple' && this.selectionModel.selected.length === 1) {
                this.close();
            }
            this._emitModelValueChange();
            this._setSelectedValueContext();
        }
    }

    isSelected(option: ThyOptionComponent): boolean {
        return this.selectionModel.isSelected(option);
    }
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }
}
