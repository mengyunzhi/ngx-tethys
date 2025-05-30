import { isEmpty, isString, isTemplateRef } from 'ngx-tethys/util';

import { Component, Input } from '@angular/core';

import { DateCell } from './types';
import { NgTemplateOutlet } from '@angular/common';

/**
 * @private
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[date-table-cell]',
    exportAs: 'dateTableCell',
    templateUrl: './date-table-cell.component.html',
    imports: [NgTemplateOutlet]
})
export class DateTableCell {
    isTemplateRef = isTemplateRef;

    @Input() prefixCls: 'thy-calendar' | 'thy-calendar-full';
    @Input() cell: DateCell;

    isNonEmptyString = (v: any) => isEmpty(v) && isString(v);
}
