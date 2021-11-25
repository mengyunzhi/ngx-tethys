import { OverlayRef } from '@angular/cdk/overlay';
import { ESCAPE, hasModifierKey } from 'ngx-tethys/util';
import { filter, take } from 'rxjs/operators';
import { ThyImageOptions } from './image-options';
import { ThyImagePreviewComponent } from './image-preview.component';

export class ThyImagePreviewRef {
    constructor(public previewInstance: ThyImagePreviewComponent, private config: ThyImageOptions, private overlayRef: OverlayRef) {
        overlayRef
            .keydownEvents()
            .pipe(filter(event => (this.config.thyKeyBoard as boolean) && event.keyCode === ESCAPE && !hasModifierKey(event)))
            .subscribe(event => {
                event.preventDefault();
                this.close();
            });

        overlayRef.detachments().subscribe(() => {
            this.overlayRef.dispose();
        });

        previewInstance.containerClick.pipe(take(1)).subscribe(() => {
            this.close();
        });

        previewInstance.closeClick.pipe(take(1)).subscribe(() => {
            this.close();
        });

        previewInstance.animationStateChanged
            .pipe(
                filter(event => event.phaseName === 'done' && event.toState === 'leave'),
                take(1)
            )
            .subscribe(() => {
                this.dispose();
            });
    }

    switchTo(index: number): void {
        this.previewInstance.switchTo(index);
    }

    next(): void {
        this.previewInstance.next();
    }

    prev(): void {
        this.previewInstance.prev();
    }

    close(): void {
        this.previewInstance.startLeaveAnimation();
    }

    private dispose(): void {
        this.overlayRef.dispose();
    }
}
