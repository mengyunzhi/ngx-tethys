import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, Signal, SimpleChanges } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ThyButton } from 'ngx-tethys/button';
import { injectLocale, ThyDatePickerLocale } from 'ngx-tethys/i18n';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyInnerTimePicker } from 'ngx-tethys/time-picker';
import { coerceBooleanProperty, TinyDate } from 'ngx-tethys/util';

/**
 * @private
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'calendar-footer',
    exportAs: 'calendarFooter',
    templateUrl: 'calendar-footer.component.html',
    imports: [ThyIcon, ThyInnerTimePicker, FormsModule, ThyButton]
})
export class CalendarFooter implements OnInit, OnChanges {
    @Input() showTime = false;
    @Input() mustShowTime = false;
    @Input() value: TinyDate;
    @Input() timeZone: string;
    @Input({ transform: coerceBooleanProperty }) disableTimeConfirm = false;
    @Output() readonly selectTime = new EventEmitter<TinyDate>();
    @Output() readonly clickOk = new EventEmitter<void>();
    @Output() readonly clickRemove = new EventEmitter<void>();
    @Output() readonly showTimePickerChange = new EventEmitter<boolean>();
    isShowTime = false;
    isCanTime = false;
    locale: Signal<ThyDatePickerLocale> = injectLocale('datePicker');

    ngOnInit() {
        this._initTimeShowMode();
        if (!this.value) {
            this.value = new TinyDate(undefined, this.timeZone);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mustShowTime) {
            this._initTimeShowMode();
        }
    }

    onSelectTime(date: Date): void {
        this.selectTime.emit(new TinyDate(date, this.timeZone));
    }

    onTimeOk() {
        if (this.disableTimeConfirm) {
            return;
        }
        this.selectTime.emit(this.value);
        this.clickOk.emit();
    }

    onClear() {
        this.value = null;
        this.clickRemove.emit();
    }

    changeTimeShowMode(type: string) {
        switch (type) {
            case 'can':
                this.isCanTime = true;
                this.isShowTime = false;
                break;
            case 'show':
                this.isCanTime = false;
                this.isShowTime = true;
                break;
        }
        this.showTimePickerChange.emit(this.isShowTime);
    }

    private _initTimeShowMode() {
        if (this.mustShowTime) {
            this.changeTimeShowMode('show');
        } else {
            if (this.showTime) {
                this.changeTimeShowMode('can');
            }
        }
    }
}
