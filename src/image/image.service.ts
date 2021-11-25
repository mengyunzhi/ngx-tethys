import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { ThyImageConfig, THY_IMAGE_CONFIG } from './image.class';
import { ThyImage, ThyImageOptions } from './image-options';
import { ThyImagePreviewRef } from './image-preview-ref';
import { IMAGE_PREVIEW_MASK_CLASS_NAME } from './image-config';
import { ThyImagePreviewComponent } from './image-preview.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable()
export class ThyImageService {
    constructor(
        private overlay: Overlay,
        @Optional() @Inject(THY_IMAGE_CONFIG) private defaultConfig: ThyImageConfig,
        private injector: Injector
    ) {}

    preview(images: ThyImage[], config?: ThyImageOptions): ThyImagePreviewRef {
        console.log(images, 'images');
        return this.showImage(images, config);
    }

    private showImage(images: ThyImage[], config?: ThyImageOptions): ThyImagePreviewRef {
        const configMerged = { ...new ThyImageOptions(), ...(config ?? {}) };
        const overlayRef = this.createOverlay(configMerged);
        const previewComponent = this.attachPreviewComponent(overlayRef, configMerged);
        previewComponent.setImages(images);
        const previewRef = new ThyImagePreviewRef(previewComponent, configMerged, overlayRef);

        previewComponent.previewRef = previewRef;
        return previewRef;
    }

    private attachPreviewComponent(overlayRef: OverlayRef, config: ThyImageOptions): ThyImagePreviewComponent {
        const injector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: OverlayRef, useValue: overlayRef },
                { provide: ThyImageOptions, useValue: config }
            ]
        });

        const containerPortal = new ComponentPortal(ThyImagePreviewComponent, null, injector);
        const containerRef = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

    private createOverlay(config: ThyImageOptions): OverlayRef {
        const defaultConfig = this.defaultConfig || {};
        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay.position().global(),
            disposeOnNavigation: true,
            backdropClass: IMAGE_PREVIEW_MASK_CLASS_NAME,
            direction: 'ltr'
        });

        return this.overlay.create(overlayConfig);
    }
}
