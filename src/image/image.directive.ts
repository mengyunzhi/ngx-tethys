import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ThyImageConfig, THY_IMAGE_CONFIG } from './image.class';
import { ThyImageService } from './image.service';

export type ImageStatusType = 'error' | 'loading' | 'normal';

@Directive({
    selector: 'img[thy-image]',
    exportAs: 'thyImage',
    host: {
        '(click)': 'onPreview()'
    }
})
export class ThyImageDirective implements OnInit, OnChanges {
    @Input() thySrc = '';

    @Input() thyFallback: string | null = null;

    @Input() thyLoadingSrc: string | null = null;

    @Input() thyDisablePreview: boolean = false;

    backLoadImage!: HTMLImageElement;

    private status: ImageStatusType = 'normal';

    get previewable(): boolean {
        return !this.thyDisablePreview && this.status !== 'error';
    }

    constructor(
        private elementRef: ElementRef,
        @Inject(THY_IMAGE_CONFIG) private imageConfig: ThyImageConfig,
        @Inject(DOCUMENT) private document: any,
        private thyImageService: ThyImageService
    ) {
        if (!this.thyFallback) {
            this.thyFallback = this.imageConfig.thyFallback || null;
        }
        if (!this.thyLoadingSrc) {
            this.thyLoadingSrc = this.imageConfig.thyLoadingSrc || null;
        }
    }

    ngOnInit() {
        this.backLoad();
        console.log(this.thySrc, 'src');
        console.log(this.thyFallback, 'fallback');
        console.log(this.thyLoadingSrc, 'loading src');
    }

    ngOnChanges(changes: SimpleChanges) {
        const { thySrc } = changes;
        if (thySrc) {
            this.getElement().nativeElement.src = thySrc.currentValue;
            this.backLoad();
        }
    }

    getElement(): ElementRef<HTMLImageElement> {
        return this.elementRef;
    }

    // 底部加载，实现fallback & loadingSrc
    private backLoad() {
        this.backLoadImage = this.document.createElement('img');
        this.backLoadImage.src = this.thySrc;
        this.status = 'loading';

        if (this.backLoadImage.complete) {
            this.status = 'normal';
            this.getElement().nativeElement.src = this.thySrc;
        } else {
            if (this.thyLoadingSrc) {
                this.getElement().nativeElement.src = this.thyLoadingSrc;
            } else {
                this.getElement().nativeElement.src = this.thySrc;
            }

            this.backLoadImage.onload = () => {
                this.status = 'normal';
                this.getElement().nativeElement.src = this.thySrc;
            };

            this.backLoadImage.onerror = () => {
                this.status = 'error';
                if (this.thyFallback) {
                    this.getElement().nativeElement.src = this.thyFallback;
                }
            };
        }
    }

    onPreview() {
        if (!this.previewable) {
            return;
        }
        const previewImages = [{ src: this.thySrc }];
        this.thyImageService.preview(previewImages);
    }
}
