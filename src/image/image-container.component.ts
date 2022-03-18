import { CdkPortalOutlet } from '@angular/cdk/portal';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    OnDestroy,
    ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { ThyAbstractOverlayContainer, ThyClickPositioner } from 'ngx-tethys/core';
import { thyImageAnimations } from './image-animations';
import { AnimationEvent } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { ThyImageConfig, ThyImageInfo } from './image.config';
import { filter } from 'rxjs/operators';
import { imageAbstractOverlayOptions } from './image.options';

@Component({
    selector: 'thy-image-container',
    templateUrl: './image-container.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [thyImageAnimations.imageContainer],
    host: {
        class: 'thy-image-container',
        tabindex: '-1',
        'aria-modal': 'true',
        '[attr.id]': 'id',
        '[attr.role]': 'config.role',
        '[attr.aria-labelledby]': 'config.ariaLabel ? null : ariaLabelledBy',
        '[attr.aria-label]': 'config.ariaLabel',
        '[attr.aria-describedby]': 'config.ariaDescribedBy || null',
        '[@imageContainer]': 'animationState',
        '(@imageContainer.start)': 'onAnimationStart($event)',
        '(@imageContainer.done)': 'onAnimationDone($event)'
    }
})
export class ThyImageContainerComponent extends ThyAbstractOverlayContainer implements OnDestroy {
    animationOpeningDone: Observable<AnimationEvent>;
    animationClosingDone: Observable<AnimationEvent>;

    @ViewChild(CdkPortalOutlet, { static: true })
    portalOutlet: CdkPortalOutlet;

    @HostBinding(`attr.id`)
    id: string;

    /** State of the dialog animation. */
    animationState: 'void' | 'enter' | 'exit' = 'void';

    /** Emits when an animation state changes. */
    animationStateChanged = new EventEmitter<AnimationEvent>();

    images: ThyImageInfo[];

    /* private elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

    private savePreviouslyFocusedElement() {
        if (this.document) {
            this.elementFocusedBeforeDialogWasOpened = this.document.activeElement as HTMLElement;

            // Note that there is no focus method when rendering on the server.
            if (this.elementRef.nativeElement.focus) {
                // Move focus onto the dialog immediately in order to prevent the user from accidentally
                // opening multiple dialogs at the same time. Needs to be async, because the element
                // may not be focusable immediately.
                Promise.resolve().then(() => this.elementRef.nativeElement.focus());
            }
        }
    } */

    private setTransformOrigin() {
        this.clickPositioner.runTaskUseLastPosition(lastPosition => {
            if (lastPosition) {
                const containerElement: HTMLElement = this.elementRef.nativeElement;
                const transformOrigin = `${lastPosition.x - containerElement.offsetLeft}px ${lastPosition.y -
                    containerElement.offsetTop}px 0px`;
                containerElement.style['transform-origin'] = transformOrigin;
                // 手动修改动画状态为从 void 到 enter, 开启动画
            }
            this.animationState = 'enter';
        });
    }

    constructor(
        private elementRef: ElementRef,
        @Inject(DOCUMENT) private document: any,
        public config: ThyImageConfig,
        private clickPositioner: ThyClickPositioner,
        changeDetectorRef: ChangeDetectorRef
    ) {
        super(imageAbstractOverlayOptions, changeDetectorRef);

        console.log(11111111);

        this.animationOpeningDone = this.animationStateChanged.pipe(
            filter((event: AnimationEvent) => {
                return event.phaseName === 'done' && event.toState === 'void';
            })
        );
        this.animationClosingDone = this.animationStateChanged.pipe(
            filter((event: AnimationEvent) => {
                return event.phaseName === 'done' && event.toState === 'exit';
            })
        );
    }

    beforeAttachPortal(): void {
        this.setTransformOrigin();
        // this.savePreviouslyFocusedElement();
    }

    /** Callback, invoked whenever an animation on the host completes. */
    onAnimationDone(event: AnimationEvent) {
        if (event.toState === 'void') {
            // this.trapFocus();
        } else if (event.toState === 'exit') {
            // this.restoreFocus();
        }
        this.animationStateChanged.emit(event);
    }

    /** Callback, invoked when an animation on the host starts. */
    onAnimationStart(event: AnimationEvent) {
        this.animationStateChanged.emit(event);
    }

    ngOnDestroy() {
        super.destroy();
    }
}
