import { Component, Injector, TemplateRef, viewChild, ViewChild, inject, afterRenderEffect } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ThyStealthView, useStealthViewRenderer } from '@tethys/cdk/dom';

@Component({
    selector: 'thy-stealth-view-test',
    template: `
        <ng-template thyStealthView>
            <span>directive test</span>
            <button thyButton="primary" disabled="disabled">Primary</button>
        </ng-template>

        <ng-template #testStealth>
            <span>function test</span>
            <button thyButton="primary" disabled="disabled">Primary</button>
        </ng-template>
    `,
    imports: [ThyStealthView]
})
class ThyStealthViewDirectiveTestComponent {
    private injector = inject(Injector);

    @ViewChild(ThyStealthView, { static: true }) thyStealthView: ThyStealthView;

    templateRef = viewChild('testStealth', { read: TemplateRef });

    nodesByDirective: Node[];

    nodesByFunction: Node[];

    stealthViewRenderer = useStealthViewRenderer(this.templateRef);

    constructor() {
        afterRenderEffect(() => {
            this.nodesByDirective = this.thyStealthView.rootNodes;
            this.nodesByFunction = this.stealthViewRenderer.rootNodes;
        });
    }
}

describe('ThyStealthViewDirective', () => {
    let fixture: ComponentFixture<ThyStealthViewDirectiveTestComponent>;
    let component: ThyStealthViewDirectiveTestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThyStealthViewDirectiveTestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should get correct nodes by Directive ', fakeAsync(() => {
        expect(component.nodesByDirective.length).toBe(2);
        const htmlString = `<span>directive test</span><button thyButton="primary" disabled="disabled">Primary</button>`;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const tempNodes = doc.body.childNodes;
        for (let i = 0; i < tempNodes.length; i++) {
            expect(component.nodesByDirective[i]).toEqual(tempNodes[i]);
        }
    }));

    it('should get correct nodes by Function ', fakeAsync(() => {
        expect(component.nodesByFunction.length).toBe(2);
        const htmlString = `<span>function test</span><button thyButton="primary" disabled="disabled">Primary</button>`;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const tempNodes = doc.body.childNodes;
        for (let i = 0; i < tempNodes.length; i++) {
            expect(component.nodesByFunction[i]).toEqual(tempNodes[i]);
        }
    }));
});
