import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { coerceBooleanProperty } from 'ngx-tethys/util';

/**
 * 骨架屏组件
 * @name thy-skeleton
 * @order 10
 */
@Component({
    selector: 'thy-skeleton',
    template: ` <ng-content></ng-content> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ThySkeleton {
    /**
     * 是否开启动画
     * @default false
     */
    @Input({ transform: coerceBooleanProperty })
    thyAnimated: boolean;

    /**
     * 动画速度
     */
    @Input() thyAnimatedInterval: string | number;

    /**
     * 骨架主色调
     */
    @Input() thyPrimaryColor: string;

    /**
     * 骨架次色调
     */
    @Input() thySecondaryColor: string;
}
