import { FocusMonitor } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { createComponentType } from '@angular/compiler/src/render3/view/compiler';
import {
    Directive,
    ElementRef,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { ThyOverlayDirectiveBase, ThyPlacement } from 'ngx-tethys/core';
import { ThyImageContainerComponent } from './image-container.component';
import { ThyImageRef } from './image-ref';
import { ThyImageConfig } from './image.config';
import { ThyImage } from './image.service';

export type ImageStatusType = 'error' | 'loading' | 'normal';

@Directive({
    selector: 'img[thyImage]',
    exportAs: 'thyImage'
    /* host: {
        '(click)': 'show()'
    } */
})
export class ThyImageDirective extends ThyOverlayDirectiveBase implements OnInit, OnChanges, OnDestroy {
    @Input() thySrc = '';

    @Input('thyImageContent') content: ComponentType<any> | TemplateRef<any>;

    @Input() thyFallback: string | null = null;

    @Input() thyLoadingSrc: string | null = null;

    @Input() thyDisablePreview = false;

    @Input() thyPlacement: ThyPlacement;

    @Input() thyConfig: ThyImageConfig;

    backLoadImage!: HTMLImageElement;

    private status: ImageStatusType = 'normal';

    get previewable(): boolean {
        return !this.thyDisablePreview && this.status !== 'error';
    }

    private imageRef: ThyImageRef<any>;

    constructor(
        elementRef: ElementRef,
        platform: Platform,
        focusMonitor: FocusMonitor,
        ngZone: NgZone,
        private image: ThyImage,
        private viewContainerRef: ViewContainerRef
    ) {
        super(elementRef, platform, focusMonitor, ngZone);
    }

    ngOnInit() {
        console.log(11111, this.thyLoadingSrc, this.thySrc, 'image component');
        this.initialize();
        this.elementRef.nativeElement.src = this.thySrc;
    }

    ngOnChanges(changes: SimpleChanges) {
        const { thySrc } = changes;
        if (thySrc) {
            /* this.getElement().nativeElement.src = thySrc.currentValue;
            this.backLoad(); */
        }
    }

    createOverlay(): OverlayRef {
        const config = Object.assign(
            {
                origin: this.elementRef.nativeElement,
                hasBackdrop: true,
                viewContainerRef: this.viewContainerRef
            },
            this.thyConfig
        );
        console.log(this.elementRef.nativeElement, this.elementRef.nativeElement.src, 'src');
        this.imageRef = this.image.open(this.content, config);
        console.log(config, 'image directive create overlay config');
        console.log(this.imageRef, 'image directive create overlay ref');
        this.imageRef.afterClosed().subscribe(() => {
            console.log('thy-image 马上要close啦');
        });
        return this.imageRef.getOverlayRef();
    }

    show(delay: number = 0) {
        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
            this.hideTimeoutId = null;
        }

        if (this.disabled || (this.overlayRef && this.overlayRef.hasAttached())) {
            return;
        }

        this.showTimeoutId = setTimeout(() => {
            const overlayRef = this.createOverlay();
            this.overlayRef = overlayRef;
            this.showTimeoutId = null;
        }, delay);
    }

    hide(delay: number = 0) {
        if (this.showTimeoutId) {
            clearTimeout(this.showTimeoutId);
            this.showTimeoutId = null;
        }

        this.hideTimeoutId = setTimeout(() => {
            if (this.imageRef) {
                this.imageRef.close();
            }
            this.hideTimeoutId = null;
        }, delay);
    }

    ngOnDestroy(): void {
        this.dispose();
    }
}
