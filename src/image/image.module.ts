import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyImagePreviewComponent } from './image-preview.component';
import { THY_IMAGE_CONFIG_PROVIDER } from './image.class';
import { ThyImageDirective } from './image.directive';
import { ThyImageService } from './image.service';

@NgModule({
    imports: [OverlayModule, CommonModule, PortalModule, ThyIconModule],
    exports: [ThyImageDirective, ThyImagePreviewComponent],
    declarations: [ThyImageDirective, ThyImagePreviewComponent],
    providers: [THY_IMAGE_CONFIG_PROVIDER, ThyImageService],
    entryComponents: [ThyImagePreviewComponent]
})
export class ThyImageModule {}
