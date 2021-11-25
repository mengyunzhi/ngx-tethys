import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { fadeMotion } from 'ngx-tethys/core/animation';
import { ThyImage, ThyImageOptions } from './image-options';
import { ThyImageConfig, THY_IMAGE_CONFIG } from './image.class';
import { OverlayRef } from '@angular/cdk/overlay';
import { FADE_CLASS_NAME_MAP } from './image-config';
import { ThyImagePreviewRef } from '.';

export interface ThyImageContainerOperation {
    icon: string;
    type: string;

    onClick(): void;
}

const initialPosition = {
    x: 0,
    y: 0
};

@Component({
    selector: 'thy-image-preview',
    exportAs: 'thyImagePreview',
    animations: [fadeMotion],
    template: `
        <div class="thy-image-preview">
            <div tabindex="0" aria-hidden="true" style="width: 0; height: 0; overflow: hidden; outline: none;"></div>
            <div class="thy-image-preview-content">
                <div class="thy-image-preview-body">
                    <ul class="thy-image-preview-operations">
                        <li
                            class="thy-image-preview-operations-operation"
                            [class.thy-image-preview-operations-operation-disabled]="zoomOutDisabled && option.type === 'zoomOut'"
                            *ngFor="let option of operations"
                            (click)="option.onClick()"
                        >
                            <thy-icon class="thy-image-preview-operations-icon" [thyIconName]="option.icon"></thy-icon>
                        </li>
                    </ul>
                    <div class="thy-image-preview-img-wrapper" [style.transform]="previewImageWrapperTransform">
                        <ng-container *ngFor="let image of images; index as imageIndex">
                            <img
                                #imgRef
                                *ngIf="index === imageIndex"
                                [src]="image.src"
                                [alt]="image.alt"
                                [style.width]="image.width"
                                [style.height]="image.height"
                                [style.transform]="previewImageTransform"
                                class="thy-image-preview-img"
                            />
                        </ng-container>
                    </div>
                    <ng-container *ngIf="images.length > 1">
                        <div
                            class="thy-image-preview-switch-left"
                            [class.thy-image-preview-switch-left-disabled]="index <= 0"
                            (click)="onSwitchLeft($event)"
                        >
                            <thy-icon thyIconName="angle-left"></thy-icon>
                        </div>
                        <div
                            class="thy-image-preview-switch-right"
                            [class.thy-image-preview-switch-right-disabled]="index >= images.length - 1"
                            (click)="onSwitchRight($event)"
                        >
                            <thy-icon thyIconName="angle-right"></thy-icon>
                        </div>
                    </ng-container>
                </div>
            </div>
            <div tabindex="0" aria-hidden="true" style="width: 0; height: 0; overflow: hidden; outline: none;"></div>
        </div>
    `,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.thy-image-preview-wrap]': 'true',
        '[@fadeMotion]': 'animationState',
        '(@fadeMotion.start)': 'onAnimationStart($event)',
        '(@fadeMotion.done)': 'onAnimationDone($event)',
        '(click)': 'onContainerClick($event)',
        tabindex: '-1',
        role: 'document'
    }
})
export class ThyImagePreviewComponent {
    animationState: 'void' | 'enter' | 'leave' = 'enter';

    animationStateChanged = new EventEmitter<AnimationEvent>();

    images: ThyImage[] = [];

    index = 0;

    previewRef!: ThyImagePreviewRef;

    containerClick = new EventEmitter<any>();

    closeClick = new EventEmitter<any>();

    zoomOutDisabled = false;

    position = { ...initialPosition };

    previewImageTransform = '';

    previewImageWrapperTransform = '';

    operations: ThyImageContainerOperation[] = [
        {
            icon: 'close',
            onClick: () => {
                console.log('close');
                this.onClose();
            },
            type: 'close'
        },
        {
            icon: 'zoom-in',
            onClick: () => {
                console.log('zoom in');
                this.onZoomIn();
            },
            type: 'zoomIn'
        },
        {
            icon: 'zoom-out',
            onClick: () => {
                console.log('zoom out');
                this.onZoomOut();
            },
            type: 'zoomOut'
        },
        {
            icon: 'redo',
            onClick: () => {
                console.log('rotate right');
                this.onRotateRight();
            },
            type: 'rotateRight'
        },
        {
            icon: 'undo',
            onClick: () => {
                console.log('rotate left');
                this.onRotateLeft();
            },
            type: 'rotateLeft'
        }
    ];

    private zoom = 1;

    private rotate = 0;

    get maskClosable(): boolean {
        return this.config.thyMaskClosable ?? true;
    }

    constructor(
        private cdr: ChangeDetectorRef,
        @Optional() @Inject(THY_IMAGE_CONFIG) private defaultConfig: ThyImageConfig,
        public config: ThyImageOptions,
        private overlayRef: OverlayRef
    ) {
        this.updateZoomOutDisabled();
        this.updatePreviewImageTransform();
        this.updatePreviewImageWrapperTransform();
    }

    setImages(images: ThyImage[]): void {
        console.log(this.previewImageTransform, 'image transform');
        this.images = images;
        this.cdr.markForCheck();
    }

    switchTo(index: number): void {
        this.index = index;
        this.cdr.markForCheck();
    }

    next() {
        if (this.index < this.images.length - 1) {
            this.reset();
            this.index++;
            this.updatePreviewImageTransform();
            this.updatePreviewImageWrapperTransform();
            this.updateZoomOutDisabled();
            this.cdr.markForCheck();
        }
    }

    prev() {
        if (this.index > 0) {
            this.reset();
            this.index--;
            this.updatePreviewImageTransform();
            this.updatePreviewImageWrapperTransform();
            this.updateZoomOutDisabled();
            this.cdr.markForCheck();
        }
    }

    onClose() {
        this.closeClick.emit();
    }

    onZoomIn() {
        this.zoom += 1;
        this.updatePreviewImageTransform();
        this.updateZoomOutDisabled();
        this.position = { ...initialPosition };
    }

    onZoomOut() {
        if (this.zoom > 1) {
            this.zoom -= 1;
            this.updatePreviewImageTransform();
            this.updateZoomOutDisabled();
            this.position = { ...initialPosition };
        }
    }

    onRotateRight() {
        this.rotate += 90;
        this.updatePreviewImageTransform();
    }

    onRotateLeft() {
        this.rotate -= 90;
        this.updatePreviewImageTransform();
    }

    onSwitchLeft(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.prev();
    }

    onSwitchRight(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.next();
    }

    onContainerClick(e: MouseEvent) {
        if (e.target === e.currentTarget && this.maskClosable) {
            this.containerClick.emit();
        }
    }

    onAnimationStart(event: AnimationEvent) {
        if (event.toState === 'enter') {
            this.setEnterAnimationClass();
        } else if (event.toState === 'leave') {
            this.setLeaveAnimationClass();
        }

        this.animationStateChanged.emit(event);
    }

    onAnimationDone(event: AnimationEvent) {
        if (event.toState === 'enter') {
            this.setEnterAnimationClass();
        } else if (event.toState === 'leave') {
            this.setLeaveAnimationClass();
        }
        this.animationStateChanged.emit(event);
    }

    startLeaveAnimation(): void {
        this.animationState = 'leave';
        this.cdr.markForCheck();
    }

    private updatePreviewImageTransform() {
        this.previewImageTransform = `scale3d(${this.zoom}, ${this.zoom}, 1) rotate(${this.rotate}deg)`;
    }

    private updatePreviewImageWrapperTransform() {
        this.previewImageWrapperTransform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
    }

    private updateZoomOutDisabled() {
        this.zoomOutDisabled = this.zoom <= 1;
    }

    private setEnterAnimationClass() {
        const backdropElement = this.overlayRef.backdropElement;
        if (backdropElement) {
            backdropElement.classList.add(FADE_CLASS_NAME_MAP.enter);
            backdropElement.classList.add(FADE_CLASS_NAME_MAP.enterActive);
        }
    }

    private setLeaveAnimationClass() {
        const backdropElement = this.overlayRef.backdropElement;
        if (backdropElement) {
            backdropElement.classList.add(FADE_CLASS_NAME_MAP.leave);
            backdropElement.classList.add(FADE_CLASS_NAME_MAP.leaveActive);
        }
    }

    private reset() {
        this.zoom = 1;
        this.rotate = 0;
        this.position = { ...initialPosition };
    }
}
