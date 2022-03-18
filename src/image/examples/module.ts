import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyImageModule } from 'ngx-tethys/image';
import { ThyImageConfig } from 'ngx-tethys/image/image.config';
import { ThyImageBasicExampleComponent } from './basic/basic.component';

const COMPONENTS = [ThyImageBasicExampleComponent];

@NgModule({
    declarations: COMPONENTS,
    entryComponents: COMPONENTS,
    exports: COMPONENTS,
    providers: [
        COMPONENTS,
        {
            provide: ThyImageConfig,
            useValue: {}
        }
    ],
    imports: [CommonModule, ThyImageModule, FormsModule]
})
export class ThyImageExamplesModule {}
