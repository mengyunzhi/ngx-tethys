import { NgModule } from '@angular/core';
import { ThyPaginationComponent } from './pagination.component';
import { CommonModule } from '@angular/common';
import { PaginationTotalCountFormat } from './pagination.pipe';
import { ThySharedModule } from 'ngx-tethys/shared';
import { THY_PAGINATION_CONFIG } from './pagination.config';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThySelectModule } from 'ngx-tethys/select';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, ThySharedModule, ThyIconModule, ThySelectModule],
    exports: [ThyPaginationComponent],
    declarations: [ThyPaginationComponent, PaginationTotalCountFormat]
})
export class ThyPaginationModule {}
