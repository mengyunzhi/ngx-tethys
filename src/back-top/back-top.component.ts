import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    Input,
    TemplateRef,
    EventEmitter,
    Output,
    HostBinding,
    NgZone,
    ChangeDetectorRef,
    OnDestroy,
    OnChanges,
    Inject,
    ViewChild,
    ElementRef
} from '@angular/core';
import { Subject, fromEvent, BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { throttleTime, takeUntil, switchMap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { fadeMotion, ThyScrollService } from 'ngx-tethys/core';

@Component({
    selector: 'thy-back-top,[thyBackTop]',
    templateUrl: './back-top.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [fadeMotion]
})
export class ThyBackTopComponent implements OnInit, OnDestroy, OnChanges {
    @HostBinding('class.thy-back-top-container') classNames = true;

    @Input() thyTemplate?: TemplateRef<void>;

    @Input() thyVisibilityHeight = 400;

    @Input() thyContainer?: string | HTMLElement;

    @Output() readonly thyClick: EventEmitter<boolean> = new EventEmitter();

    @Output() public visibleChange: EventEmitter<boolean> = new EventEmitter();

    /** The native `<div class="thy-back-top"></div>` element. */
    @ViewChild('backTop', { static: false })
    set backTop(backTop: ElementRef<HTMLElement> | undefined) {
        this.backTop$.next(backTop);
    }

    public visible = false;

    /**
     * The subject used to store the native `<div class="thy-back-top"></div>` since
     * it's located within the `ngIf` directive. It might be set asynchronously whenever the condition
     * is met. Having subject makes the code reactive and cancellable (e.g. event listeners will be
     * automatically removed and re-added through the `switchMap` below).
     */
    private backTop$ = new BehaviorSubject<ElementRef<HTMLElement> | undefined>(undefined);

    private destroy$ = new Subject<void>();
    private scrollListenerDestroy$ = new Subject();

    private target: HTMLElement | null = null;

    constructor(
        @Inject(DOCUMENT) private doc: any,
        private thyScrollService: ThyScrollService,
        private platform: Platform,
        private cdr: ChangeDetectorRef,
        private zone: NgZone
    ) {
        this.backTop$
            .pipe(
                switchMap(backTop =>
                    backTop
                        ? new Observable(subscriber =>
                              zone.runOutsideAngular(() => fromEvent(backTop.nativeElement, 'click').subscribe(subscriber))
                          )
                        : EMPTY
                ),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.thyScrollService.scrollTo(this.getTarget(), 0);
                if (this.thyClick.observers.length) {
                    zone.run(() => this.thyClick.emit(true));
                }
            });
    }

    ngOnInit(): void {
        this.registerScrollEvent();
    }

    private getTarget(): HTMLElement | Window {
        return this.target || window;
    }

    private handleScroll(): void {
        if (this.visible === this.thyScrollService.getScroll(this.getTarget()) > this.thyVisibilityHeight) {
            return;
        }
        this.visible = !this.visible;
        this.cdr.detectChanges();
        if (this.visibleChange.observers.length > 0) {
            this.zone.run(() => {
                this.visibleChange.emit(this.visible);
            });
        }
    }

    private registerScrollEvent(): void {
        if (!this.platform.isBrowser) {
            return;
        }
        this.scrollListenerDestroy$.next();
        this.handleScroll();
        this.zone.runOutsideAngular(() => {
            fromEvent(this.getTarget(), 'scroll', { passive: true })
                .pipe(throttleTime(50), takeUntil(this.scrollListenerDestroy$))
                .subscribe(() => this.handleScroll());
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.scrollListenerDestroy$.next();
    }

    ngOnChanges(changes: any): void {
        const { thyContainer } = changes;
        if (thyContainer) {
            this.target = typeof this.thyContainer === 'string' ? this.doc.querySelector(this.thyContainer) : this.thyContainer;
            this.registerScrollEvent();
        }
    }
}
