import { Directive, Renderer2, Input, ElementRef, Output, EventEmitter, OnDestroy, NgZone } from '@angular/core';

@Directive({ selector: '[thyShow]' })
export class ThyShowDirective implements OnDestroy {
    @Output() thyShowChange = new EventEmitter();

    private unListenEvent: () => void;

    private unListenDocument() {
        if (this.unListenEvent) {
            this.unListenEvent();
            this.unListenEvent = null;
        }
    }

    @Input() set thyShow(condition: boolean) {
        if (condition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
            this.ngZone.runOutsideAngular(() =>
                setTimeout(() => {
                    this.unListenEvent = this.renderer.listen('document', 'click', event => {
                        if (!this.elementRef.nativeElement.contains(event.target)) {
                            if (this.thyShowChange.observers.length) {
                                this.ngZone.run(() => this.thyShowChange.emit(false));
                            }
                            this.unListenDocument();
                        }
                    });
                })
            );
        } else {
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
            this.unListenDocument();
        }
    }

    constructor(private elementRef: ElementRef<HTMLElement>, private renderer: Renderer2, private ngZone: NgZone) {}

    ngOnDestroy() {
        this.unListenDocument();
    }
}
