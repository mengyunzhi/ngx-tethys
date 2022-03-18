import { Inject, Injectable, Injector, OnDestroy, Optional, StaticProvider, TemplateRef } from '@angular/core';
import { ThyAbstractOverlayRef, ThyAbstractOverlayService, ThyClickPositioner } from 'ngx-tethys/core';
import { ThyImageContainerComponent } from './image-container.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { of } from 'rxjs';
import { Directionality } from '@angular/cdk/bidi';
import { ThyImageRef, ThyInternalImageRef } from './image-ref';
import { ThyImageConfig, ThyImageInfo } from './image.config';
import { THY_IMAGE_DEFAULT_OPTIONS } from '.';
import { imageAbstractOverlayOptions } from './image.options';

@Injectable()
export class ThyImage extends ThyAbstractOverlayService<ThyImageConfig, ThyImageContainerComponent> implements OnDestroy {
    protected buildOverlayConfig(config: ThyImageConfig<any>): OverlayConfig {
        // const size = config.size || ThyDialogSizes.md;
        const size = 'md';
        console.log(config, 'image config');
        const overlayConfig = this.buildBaseOverlayConfig(config);
        overlayConfig.positionStrategy = this.overlay.position().global();
        console.log(this.overlay.position(), this.overlay.position().global(), 'overlay position');
        overlayConfig.scrollStrategy = config.scrollStrategy || this.overlay.scrollStrategies.block();
        console.log(overlayConfig, 'image overlay config');
        return overlayConfig;
    }

    protected attachOverlayContainer(overlay: OverlayRef, config: ThyImageConfig<any>): ThyImageContainerComponent {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this.injector,
            providers: [{ provide: ThyImageConfig, useValue: config }]
        });
        const containerPortal = new ComponentPortal(ThyImageContainerComponent, config.viewContainerRef, injector);
        const containerRef = overlay.attach<ThyImageContainerComponent>(containerPortal);

        return containerRef.instance;
    }

    protected createAbstractOverlayRef<T, TResult>(
        overlayRef: OverlayRef,
        containerInstance: ThyImageContainerComponent,
        config: ThyImageConfig<any>
    ): ThyAbstractOverlayRef<T, ThyImageContainerComponent, TResult> {
        return new ThyInternalImageRef(overlayRef, containerInstance, config);
    }

    protected createInjector<T>(config: ThyImageConfig, dialogRef: ThyImageRef<T>, dialogContainer: ThyImageContainerComponent): Injector {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

        const injectionTokens: StaticProvider[] = [
            { provide: ThyImageContainerComponent, useValue: dialogContainer },
            {
                provide: ThyImageRef,
                useValue: dialogRef
            }
        ];

        if (config.direction && (!userInjector || !userInjector.get<Directionality | null>(Directionality, null))) {
            injectionTokens.push({
                provide: Directionality,
                useValue: {
                    value: config.direction,
                    change: of()
                }
            });
        }

        return Injector.create({ parent: userInjector || this.injector, providers: injectionTokens });
    }

    constructor(
        overlay: Overlay,
        injector: Injector,
        @Optional()
        @Inject(THY_IMAGE_DEFAULT_OPTIONS)
        defaultConfig: ThyImageConfig,
        clickPositioner: ThyClickPositioner
    ) {
        super(imageAbstractOverlayOptions, overlay, injector, defaultConfig);
        clickPositioner.initialize();
    }

    open<T, TData = unknown, TResult = unknown>(
        componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        config?: ThyImageConfig<TData>,
        imageConfig?: ThyImageInfo
    ): ThyImageRef<T, TResult> {
        const imageRef = this.openOverlay(componentOrTemplateRef, config);
        const imageRefInternal = imageRef as ThyInternalImageRef<T, TResult>;
        // const imageContainer = this.attachOverlayContainer(imageRef, config);

        console.log(imageRef.containerInstance.config, 'image ref config');

        imageRefInternal.updateSizeAndPosition(
            imageRef.containerInstance.config.width,
            imageRef.containerInstance.config.height,
            imageRef.containerInstance.config.position
        );
        return imageRef as ThyImageRef<T, TResult>;
    }

    ngOnDestroy(): void {
        this.dispose();
    }
}
