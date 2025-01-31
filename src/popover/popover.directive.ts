import {
    Directive,
    ElementRef,
    NgZone,
    OnDestroy,
    Input,
    TemplateRef,
    OnInit,
    ViewContainerRef,
    HostBinding,
    ChangeDetectorRef
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { OverlayRef } from '@angular/cdk/overlay';
import { FocusMonitor } from '@angular/cdk/a11y';
import { InputBoolean, ThyOverlayDirectiveBase, ThyOverlayTrigger, ThyPlacement } from 'ngx-tethys/core';
import { ThyPopover } from './popover.service';
import { ComponentType } from '@angular/cdk/portal';
import { ThyPopoverRef } from './popover-ref';
import { ThyPopoverConfig } from './popover.config';

@Directive({
    selector: '[thyPopover]'
})
export class ThyPopoverDirective extends ThyOverlayDirectiveBase implements OnInit, OnDestroy {
    @HostBinding(`class.thy-popover-opened`) popoverOpened = false;

    @Input('thyPopover') content: ComponentType<any> | TemplateRef<any>;

    @Input() set thyTrigger(trigger: ThyOverlayTrigger) {
        this.trigger = trigger;
    }

    @Input() thyPlacement: ThyPlacement;

    @Input() thyOffset: number;

    @Input() thyConfig: ThyPopoverConfig;

    @Input('thyShowDelay') showDelay = 0;

    @Input('thyHideDelay') hideDelay = 0;

    @Input() thyAutoAdaptive = false;

    @Input() @InputBoolean() set thyDisabled(value: boolean) {
        this.disabled = value;
    }

    private popoverRef: ThyPopoverRef<any>;

    constructor(
        public elementRef: ElementRef,
        platform: Platform,
        focusMonitor: FocusMonitor,
        ngZone: NgZone,
        private popover: ThyPopover,
        private viewContainerRef: ViewContainerRef,
        private cdr: ChangeDetectorRef
    ) {
        super(elementRef, platform, focusMonitor, ngZone, true);
    }

    ngOnInit(): void {
        this.initialize();
    }

    createOverlay(): OverlayRef {
        const config = Object.assign(
            {
                origin: this.elementRef.nativeElement,
                hasBackdrop: this.trigger === 'click' || this.trigger === 'focus',
                viewContainerRef: this.viewContainerRef,
                placement: this.thyPlacement,
                offset: this.thyOffset,
                autoAdaptive: this.thyAutoAdaptive
            },
            this.thyConfig
        );
        this.popoverRef = this.popover.open(this.content, config);

        this.popoverRef.afterClosed().subscribe(() => {
            this.popoverOpened = false;
        });

        return this.popoverRef.getOverlayRef();
    }

    show(delay: number = this.showDelay) {
        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
            this.hideTimeoutId = null;
        }

        if (this.disabled || (this.overlayRef && this.overlayRef.hasAttached())) {
            return;
        }
        if (this.trigger !== 'hover') {
            delay = 0;
        }

        this.showTimeoutId = setTimeout(() => {
            if (!this.disabled) {
                const overlayRef = this.createOverlay();
                this.overlayRef = overlayRef;
                this.popoverOpened = true;
                this.cdr.markForCheck();
            }
            this.showTimeoutId = null;
        }, delay);
    }

    hide(delay: number = this.hideDelay) {
        if (this.showTimeoutId) {
            clearTimeout(this.showTimeoutId);
            this.showTimeoutId = null;
        }

        this.hideTimeoutId = setTimeout(() => {
            if (this.popoverRef) {
                this.popoverRef.close();
                this.cdr.markForCheck();
            }
            this.hideTimeoutId = null;
        }, delay);
    }

    ngOnDestroy() {
        this.dispose();
    }
}
