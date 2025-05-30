import { ThyClickDispatcher } from 'ngx-tethys/core';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { combineLatest, fromEvent, Subject, Subscription, timer } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { OverlayOutsideClickDispatcher, OverlayRef } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    NgZone,
    numberAttribute,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    inject
} from '@angular/core';

import { ThyProperties } from './properties.component';
import { coerceBooleanProperty } from 'ngx-tethys/util';

export type ThyPropertyItemOperationTrigger = 'hover' | 'always';

/**
 * 属性组件
 * @name thy-property-item
 */
@Component({
    selector: 'thy-property-item',
    templateUrl: './property-item.component.html',
    host: {
        class: 'thy-property-item',
        '[class.thy-property-item-operational]': '!!operation',
        '[class.thy-property-item-operational-hover]': "thyOperationTrigger === 'hover'"
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThyFlexibleText, NgTemplateOutlet]
})
export class ThyPropertyItem implements OnInit, OnChanges, OnDestroy {
    private cdr = inject(ChangeDetectorRef);
    private clickDispatcher = inject(ThyClickDispatcher);
    private ngZone = inject(NgZone);
    private overlayOutsideClickDispatcher = inject(OverlayOutsideClickDispatcher);
    private parent = inject(ThyProperties);

    /**
     * 属性名称
     * @type sting
     * @default thyLabelText
     */
    @Input() thyLabelText: string;

    /**
     * 设置属性是否是可编辑的
     * @type sting
     * @default false
     */
    @Input({ transform: coerceBooleanProperty }) thyEditable: boolean;

    /**
     * 设置跨列的数量
     * @type number
     */
    @Input({ transform: numberAttribute }) thySpan: number = 1;

    /**
     * 设置属性操作现实触发方式，默认 always 一直显示
     * @type 'hover' | 'always'
     */
    @Input() thyOperationTrigger: ThyPropertyItemOperationTrigger = 'always';

    @Output() thyEditingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * 属性名称自定义模板
     * @type TemplateRef
     */
    @ContentChild('label', { static: true }) label!: TemplateRef<void>;

    /**
     * 属性内容编辑模板，只有在 thyEditable 为 true 时生效
     * @type TemplateRef
     */
    @ContentChild('editor', { static: true }) editor!: TemplateRef<void>;

    /**
     * 操作区模板
     * @type TemplateRef
     */
    @ContentChild('operation', { static: true }) operation!: TemplateRef<void>;

    /**
     * @private
     */
    @ViewChild('contentTemplate', { static: true }) content!: TemplateRef<void>;

    /**
     * @private
     */
    @ViewChild('item', { static: true }) itemContent: ElementRef<HTMLElement>;

    editing: boolean;

    changes$ = new Subject<SimpleChanges>();

    private destroy$ = new Subject<void>();

    private eventDestroy$ = new Subject<void>();

    private originOverlays: OverlayRef[] = [];

    private clickEventSubscription: Subscription;

    @HostBinding('style.grid-column')
    get gridColumn() {
        return `span ${Math.min(this.thySpan, this.parent.thyColumn)}`;
    }

    isVertical = false;

    constructor() {
        this.originOverlays = [...this.overlayOutsideClickDispatcher._attachedOverlays] as OverlayRef[];
    }

    ngOnInit() {
        this.subscribeClick();
        this.parent.layout$.pipe(takeUntil(this.destroy$)).subscribe(layout => {
            this.isVertical = layout === 'vertical';
            this.cdr.markForCheck();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.thyEditable && changes.thyEditable.currentValue) {
            this.subscribeClick();
        } else {
            this.setEditing(false);
            this.eventDestroy$.next();
            this.eventDestroy$.complete();

            if (this.clickEventSubscription) {
                this.clickEventSubscription.unsubscribe();
                this.clickEventSubscription = null;
            }
        }
    }

    setEditing(editing: boolean) {
        this.ngZone.run(() => {
            if (!!this.editing !== !!editing) {
                this.thyEditingChange.emit(editing);
            }
            this.editing = editing;
            this.cdr.markForCheck();
        });
    }

    /**
     * @deprecated please use setEditing(editing: boolean)
     */
    setKeepEditing(keep: boolean) {
        this.setEditing(keep);
    }

    private hasOverlay() {
        return !!this.overlayOutsideClickDispatcher._attachedOverlays.filter(overlay => !this.originOverlays.includes(overlay)).length;
    }

    private subscribeClick() {
        if (this.thyEditable === true) {
            this.ngZone.runOutsideAngular(() => {
                if (this.clickEventSubscription) {
                    return;
                }
                this.clickEventSubscription = fromEvent(this.itemContent.nativeElement, 'click')
                    .pipe(takeUntil(this.eventDestroy$))
                    .subscribe(() => {
                        this.setEditing(true);
                        this.bindEditorBlurEvent(this.itemContent.nativeElement);
                    });
            });
        }
    }

    private subscribeOverlayDetach() {
        const openedOverlays = this.overlayOutsideClickDispatcher._attachedOverlays.filter(
            overlay => !this.originOverlays.includes(overlay)
        );
        const overlaysDetachments$ = openedOverlays.map(overlay => overlay.detachments());
        if (overlaysDetachments$.length) {
            combineLatest(overlaysDetachments$)
                .pipe(delay(50), take(1), takeUntil(this.destroy$))
                .subscribe(() => {
                    this.setEditing(false);
                });
        }
    }

    private subscribeDocumentClick(editorElement: HTMLElement) {
        this.clickDispatcher
            .clicked(0)
            .pipe(
                filter(event => {
                    return !editorElement.contains(event.target as HTMLElement);
                }),
                take(1),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.setEditing(false);
            });
    }

    private bindEditorBlurEvent(editorElement: HTMLElement) {
        timer(0).subscribe(() => {
            if (this.hasOverlay()) {
                this.subscribeOverlayDetach();
            } else {
                this.subscribeDocumentClick(editorElement);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.eventDestroy$.next();
        this.eventDestroy$.complete();
    }
}
