import { ThyImageContainerComponent } from './image-container.component';
import { ThyAbstractInternalOverlayRef, ThyAbstractOverlayPosition, ThyAbstractOverlayRef } from 'ngx-tethys/core';
import { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { ThyImageConfig } from './image.config';
import { imageAbstractOverlayOptions } from './image.options';

export abstract class ThyImageRef<T, TResult = unknown> extends ThyAbstractOverlayRef<T, ThyImageContainerComponent, TResult> {}

export class ThyInternalImageRef<T, TResult = unknown> extends ThyAbstractInternalOverlayRef<T, ThyImageContainerComponent, TResult> {
    constructor(overlayRef: OverlayRef, containerInstance: ThyImageContainerComponent, config: ThyImageConfig<T>) {
        super(imageAbstractOverlayOptions, overlayRef, containerInstance, config);
    }

    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    updatePosition(position?: ThyAbstractOverlayPosition): this {
        console.log(position, 'update position');
        this.updateGlobalPosition(position);
        return this;
    }

    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSizeAndPosition(width: string = '', height: string = '', position?: ThyAbstractOverlayPosition): this {
        console.log(position, 'update size and position');
        (this.getPositionStrategy() as GlobalPositionStrategy).width(width).height(height);
        this.updatePosition(position);
        return this;
    }
}
