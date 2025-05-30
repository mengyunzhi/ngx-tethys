import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { useHostRenderer } from '@tethys/cdk/dom';

export type ThyInputSize = 'xs' | 'sm' | 'md' | 'lg' | '';

const inputGroupSizeMap = {
    xs: ['form-control-xs'],
    sm: ['form-control-sm'],
    md: ['form-control-md'],
    lg: ['form-control-lg']
};

/**
 * 输入框指令
 * @name thyInput
 * @order 10
 */
@Directive({
    selector: 'input[thyInput], select[thyInput], textarea[thyInput]',
    exportAs: 'thyInput'
})
export class ThyInputDirective implements OnInit {
    private elementRef = inject(ElementRef);
    private render = inject(Renderer2);
    private control = inject(NgControl, { optional: true, self: true })!;

    @HostBinding('class.form-control') isFormControl = true;

    private initialized = false;

    private hostRenderer = useHostRenderer();

    /**
     * 输入框大小
     * @type 'xs' | 'sm' | 'md' | 'default' | 'lg'
     * @default default
     */
    @Input()
    set thySize(size: ThyInputSize) {
        if (size && inputGroupSizeMap[size]) {
            this.hostRenderer.updateClass(inputGroupSizeMap[size]);
        } else {
            this.hostRenderer.updateClass([]);
        }
    }

    get ngControl() {
        return this.control;
    }

    get nativeElement(): HTMLInputElement {
        return this.elementRef.nativeElement;
    }

    ngOnInit() {
        this.initialized = true;
    }
}
