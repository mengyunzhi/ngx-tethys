import { useHostRenderer } from '@tethys/cdk/dom';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    DestroyRef,
    Directive,
    HostBinding,
    inject,
    Input,
    OnInit,
    QueryList,
    TemplateRef
} from '@angular/core';
import { ThySpacingSize, getNumericSize } from 'ngx-tethys/core';
import { NgTemplateOutlet } from '@angular/common';
import { coerceBooleanProperty } from 'ngx-tethys/util';

/**
 * 间距组件项，使用结构性指令 *thySpaceItem 传入模板
 * @name thySpaceItem
 * @order 20
 */
@Directive({
    selector: '[thySpaceItem]',
    host: {
        class: 'thy-space-item'
    }
})
export class ThySpaceItemDirective implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}

const DEFAULT_SIZE: ThySpacingSize = 'md';

/**
 * 间距组件
 * @name thy-space
 * @order 10
 */
@Component({
    selector: 'thy-space',
    templateUrl: './space.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-space'
    },
    imports: [NgTemplateOutlet]
})
export class ThySpace implements OnInit, AfterContentInit {
    private cdr = inject(ChangeDetectorRef);

    private readonly destroyRef = inject(DestroyRef);

    public space: number = getNumericSize(DEFAULT_SIZE);

    private hostRenderer = useHostRenderer();

    /**
     * 大小，支持 `zero` | `xxs` | `xs` | `sm` | `md` | `lg` | `xlg` 和自定义数字大小
     * @type string | number
     */
    @Input() set thySize(size: ThySpacingSize) {
        this.space = getNumericSize(size, DEFAULT_SIZE);
    }

    /**
     * 间距垂直方向，默认是水平方向
     */
    @HostBinding(`class.thy-space-vertical`)
    @Input({ transform: coerceBooleanProperty })
    thyVertical: boolean = false;

    // @ClassBinding(`align-items-{{value}}`)
    /**
     * 对齐方式，可选择 `start` | `end` | `baseline` | `center`
     */
    @Input()
    set thyAlign(align: string) {
        this.hostRenderer.updateClass(align ? [`align-items-${align}`] : []);
    }

    @ContentChildren(ThySpaceItemDirective, { read: TemplateRef }) items!: QueryList<TemplateRef<HTMLElement>>;

    ngOnInit(): void {}

    ngAfterContentInit(): void {
        this.items.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.cdr.markForCheck();
        });
    }
}
