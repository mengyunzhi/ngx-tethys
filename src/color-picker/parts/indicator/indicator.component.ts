import { Component, HostBinding, Input } from '@angular/core';
import { ThyColor } from '../../helpers/color.class';

/**
 * @internal
 */
@Component({
    selector: 'thy-indicator',
    templateUrl: './indicator.component.html'
})
export class ThyIndicator {
    @HostBinding('class.thy-indicator') className = true;

    @Input()
    public color: ThyColor;

    public get backgroundColor(): string {
        return this.color.rgba.toString();
    }
}
