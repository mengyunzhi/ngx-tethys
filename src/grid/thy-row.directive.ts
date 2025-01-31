import { Directive, HostBinding, Input, Renderer2, OnChanges, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { mixinUnsubscribe, MixinBase, Constructor, ThyUnsubscribe } from 'ngx-tethys/core';
import { isString } from 'ngx-tethys/util';

export type ThyRowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';
export type ThyRowAlign = 'top' | 'middle' | 'bottom';

const _MixinBase: Constructor<ThyUnsubscribe> & typeof MixinBase = mixinUnsubscribe(MixinBase);
@Directive({
    selector: '[thyRow]',
    host: {
        class: 'thy-row'
    }
})
export class ThyRowDirective extends _MixinBase implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() thyGutter: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };

    public actualGutter$ = new ReplaySubject<[number, number]>(1);

    constructor(private renderer: Renderer2, private elementRef: ElementRef) {
        super();
    }

    ngOnInit() {
        this._setGutterStyle();
    }

    ngOnChanges() {
        this._setGutterStyle();
    }

    ngAfterViewInit(): void {}

    private _setGutterStyle() {
        const [horizontalGutter, verticalGutter] = this._getGutter();
        this.actualGutter$.next([horizontalGutter, verticalGutter]);
        const renderGutter = (name: string, gutter: number) => {
            const nativeElement = this.elementRef.nativeElement;
            this.renderer.setStyle(nativeElement, name, `-${gutter / 2}px`);
        };
        if (horizontalGutter > 0) {
            renderGutter('margin-left', horizontalGutter);
            renderGutter('margin-right', horizontalGutter);
        }
        if (verticalGutter > 0) {
            renderGutter('margin-top', verticalGutter);
            renderGutter('margin-bottom', verticalGutter);
        }
    }

    private _getGutter() {
        if (isString(this.thyGutter)) {
            throw Error(`thyGutter value can not be string type`);
        }
        return [this.thyGutter as number, 0];
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
