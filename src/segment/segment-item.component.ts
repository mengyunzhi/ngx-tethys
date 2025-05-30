import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    NgZone,
    OnDestroy,
    Renderer2,
    inject
} from '@angular/core';
import { IThySegmentItemComponent, THY_SEGMENTED_COMPONENT } from './segment.token';
import { assertIconOnly, coerceBooleanProperty } from 'ngx-tethys/util';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SafeAny } from 'ngx-tethys/types';
import { ThyIcon } from 'ngx-tethys/icon';
import { NgClass } from '@angular/common';

/**
 * 分段控制器的选项组件
 * @name thy-segment-item,[thy-segment-item]
 */
@Component({
    selector: 'thy-segment-item,[thy-segment-item]',
    templateUrl: './segment-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-segment-item'
    },
    imports: [NgClass, ThyIcon]
})
export class ThySegmentItem implements IThySegmentItemComponent, AfterViewInit, OnDestroy {
    elementRef = inject(ElementRef);
    private ngZone = inject(NgZone);
    private cdr = inject(ChangeDetectorRef);
    private renderer = inject(Renderer2);
    private parent = inject(THY_SEGMENTED_COMPONENT, { optional: true })!;

    /**
     * 选项的值
     */
    @Input() thyValue: SafeAny;

    /**
     * 选项的图标
     */
    @Input() thyIcon: string;

    /**
     * 是否禁用该选项
     */
    @Input({ transform: coerceBooleanProperty })
    @HostBinding(`class.disabled`)
    thyDisabled = false;

    public isOnlyIcon: boolean;

    public isWithText: boolean;

    private destroy$ = new Subject<void>();

    constructor() {
        const elementRef = this.elementRef;
        const ngZone = this.ngZone;

        ngZone.runOutsideAngular(() =>
            fromEvent(elementRef.nativeElement, 'click')
                .pipe(takeUntil(this.destroy$))
                .subscribe((event: Event) => {
                    if (!this.thyDisabled && !this.parent.thyDisabled && this.parent.selectedItem && this.parent.selectedItem !== this) {
                        ngZone.run(() => {
                            this.parent.selectedItem.unselect();
                            this.parent.changeSelectedItem(this, event);
                        });
                    }
                })
        );
    }

    ngAfterViewInit(): void {
        const labelDiv = this.elementRef.nativeElement.children[0];
        this.isOnlyIcon = assertIconOnly(labelDiv) && this.parent.thyMode === 'inline';
        this.cdr.detectChanges();

        this.wrapSpanForText(labelDiv.childNodes);
    }

    public select(): void {
        this.elementRef.nativeElement.classList.add('active');
    }

    public unselect(): void {
        this.elementRef.nativeElement.classList.remove('active');
    }

    private wrapSpanForText(nodes: NodeList): void {
        nodes.forEach(node => {
            if (node.nodeName === '#text') {
                const span = this.renderer.createElement('span');
                const parent = this.renderer.parentNode(node);
                this.renderer.insertBefore(parent, span, node);
                this.renderer.appendChild(span, node);
            }

            if (node.nodeName === '#text' || node.nodeName === 'SPAN') {
                this.isWithText = true;
                this.cdr.detectChanges();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
