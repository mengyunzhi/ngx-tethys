import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThySharedModule } from 'ngx-tethys/shared';
import { ThyImageContainerComponent } from './image-container.component';
import { THY_IMAGE_DEFAULT_OPTIONS_PROVIDER } from './image.config';
import { ThyImageDirective } from './image.directive';
import { ThyImage } from './image.service';

@NgModule({
    declarations: [ThyImageContainerComponent, ThyImageDirective],
    imports: [CommonModule, ThySharedModule, PortalModule, OverlayModule, ThyIconModule, ThyButtonModule, FormsModule],
    providers: [ThyImage, THY_IMAGE_DEFAULT_OPTIONS_PROVIDER],
    entryComponents: [ThyImageContainerComponent],
    exports: [ThyImageContainerComponent, ThyImageDirective]
})
export class ThyImageModule {}
