import { Component, HostBinding, ElementRef, Input, Renderer2, TemplateRef, OnDestroy } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { ThyPopover } from 'ngx-tethys/popover';

/**
 * 菜单项操作组件
 */
@Component({
    selector: 'thy-menu-item-action,[thy-menu-item-action],[thyMenuItemAction]',
    templateUrl: './menu-item-action.component.html',
    host: {
        class: 'thy-menu-item-action'
    }
})
export class ThyMenuItemActionComponent implements OnDestroy {
    _boundEvent = false;

    _actionMenu: ComponentType<any> | TemplateRef<any>;

    /**
     * 操作菜单
     */
    @Input()
    set thyActionMenu(value: ComponentType<any> | TemplateRef<any>) {
        this._actionMenu = value;
        if (this._actionMenu) {
            this.bindClickEvent();
        }
    }

    @Input() thyStopPropagation = true;

    private bindClickEvent() {
        if (this._boundEvent) {
            return;
        }
        this._boundEvent = true;
        this.removeClickListenerFn = this.renderer.listen(this.elementRef.nativeElement, 'click', event => {
            if (this.thyStopPropagation) {
                event.stopPropagation();
            }
            if (this._actionMenu) {
                this.popover.open(this._actionMenu, {
                    origin: event.currentTarget as HTMLElement,
                    insideClosable: true,
                    placement: 'bottom'
                });
            }
        });
    }

    private removeClickListenerFn: VoidFunction | null = null;

    constructor(private popover: ThyPopover, private renderer: Renderer2, private elementRef: ElementRef) {}

    ngOnDestroy(): void {
        this.removeClickListenerFn?.();
    }
}
