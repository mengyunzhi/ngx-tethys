import { ScrollStrategy } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';
import { ThyAbstractOverlayConfig, ThyAbstractOverlayPosition } from 'ngx-tethys/core';

export interface ThyImageInfo {
    src: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
}

export class ThyImageConfig<TData = unknown> extends ThyAbstractOverlayConfig<TData> {
    /** The ARIA role of the dialog element. */
    // role?: ThyDialogRole = 'dialog';

    /** Position overrides. */
    position?: ThyAbstractOverlayPosition;

    /** Dialog size md, lg, sm*/
    // size?: ThyDialogSizes;

    /** Scroll strategy to be used for the dialog. */
    scrollStrategy?: ScrollStrategy;
}

/** Injection token that can be used to specify default dialog options. */
export const THY_IMAGE_DEFAULT_OPTIONS = new InjectionToken<ThyImageConfig>('thy-image-default-options');

export const THY_IMAGE_DEFAULT_OPTIONS_PROVIDER = {
    provide: THY_IMAGE_DEFAULT_OPTIONS,
    useValue: {
        role: 'image',
        hasBackdrop: true,
        backdropClass: '',
        panelClass: '',
        backdropClosable: true,
        closeOnNavigation: true,
        autoFocus: true,
        restoreFocus: true
    }
};
