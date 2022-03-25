import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ThyInputModule } from 'ngx-tethys/input';
import { ThyCascaderComponent } from './cascader.component';
import { ThyCascaderOptionComponent } from './cascader-li.component';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThySelectCommonModule } from 'ngx-tethys/shared';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';

@NgModule({
    imports: [CommonModule, FormsModule, OverlayModule, ThyInputModule, ThyIconModule, ThySelectCommonModule, ThyCheckboxModule],
    declarations: [ThyCascaderComponent, ThyCascaderOptionComponent],
    exports: [ThyCascaderComponent]
})
export class ThyCascaderModule {}
