import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThyPopoverBodyComponent, ThyPopoverHeaderComponent } from '../index';
import { ThyPopoverModule } from '../module';

@Component({
    selector: 'thy-popover-header-basic',
    template: '<thy-popover-header thyTitle="I am popover header" (thyClosed)="close()"></thy-popover-header>'
})
class PopoverHeaderBasicComponent {
    close() {}
}

@Component({
    selector: 'thy-popover-header-translation',
    template: '<thy-popover-header thyTitleTranslationKey="Translation Key Title"></thy-popover-header>'
})
class PopoverHeaderTranslationComponent {}

@Component({
    selector: 'thy-popover-body-basic',
    template: '<thy-popover-body></thy-popover-body>'
})
class PopoverBodyBasicComponent {}

describe('popover-layout', () => {
    describe('popover-header', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThyPopoverModule],
                declarations: [PopoverHeaderBasicComponent]
            });
            TestBed.compileComponents();
        });

        let popoverBasicFixture: ComponentFixture<PopoverHeaderBasicComponent>;
        let popoverHeaderDebugElement: DebugElement;
        let popoverHeaderElement: HTMLElement;

        beforeEach(() => {
            popoverBasicFixture = TestBed.createComponent(PopoverHeaderBasicComponent);
            popoverBasicFixture.detectChanges();
            popoverHeaderDebugElement = popoverBasicFixture.debugElement.query(By.directive(ThyPopoverHeaderComponent));
            popoverHeaderElement = popoverHeaderDebugElement.nativeElement;
        });

        it('should create', () => {
            expect(popoverBasicFixture).toBeTruthy();
            expect(popoverHeaderDebugElement).toBeTruthy();
            expect(popoverHeaderElement).toBeTruthy();
        });

        it('should has correct DOM structure', () => {
            const thyPopoverHeaderNode = popoverHeaderElement.children[0];
            expect(thyPopoverHeaderNode.childElementCount).toEqual(2);
            expect(thyPopoverHeaderNode.classList).toContain('thy-popover-header');

            const thyTitleNode = thyPopoverHeaderNode.children[0];
            expect(thyTitleNode.nodeName).toEqual('H5');
            expect(thyTitleNode.nodeType).toEqual(1);
            expect(thyTitleNode.childElementCount).toEqual(0);
            expect(thyTitleNode.classList).toContain('thy-popover-title');

            const closeButtonNode = thyPopoverHeaderNode.children[1];
            expect(closeButtonNode.nodeName).toEqual('BUTTON');
            expect(closeButtonNode.nodeType).toEqual(1);
            expect(closeButtonNode.childElementCount).toEqual(1);
            expect(closeButtonNode.classList).toContain('close');
            expect(closeButtonNode.attributes['type'].nodeValue).toEqual('button');

            const closeIconNode = closeButtonNode.children[0];
            expect(closeIconNode.childElementCount).toEqual(0);
            expect(closeIconNode.nodeName).toEqual('THY-ICON');
            expect(closeIconNode.nodeType).toEqual(1);
            expect(closeIconNode.attributes['thyiconname'].nodeValue).toEqual('close-bold');
        });

        it('should has correct title', () => {
            expect(popoverHeaderElement.textContent.includes('I am popover header')).toBeTruthy();
        });

        it('should support thyClosed', () => {
            const closeSpy = jasmine.createSpy('after thyClosed subscribe spy');
            popoverHeaderDebugElement.componentInstance.thyClosed.subscribe(() => {
                closeSpy();
            });

            const closeButton = popoverBasicFixture.nativeElement.querySelector('.close');
            closeButton.click();
            popoverBasicFixture.detectChanges();
            expect(closeSpy).toHaveBeenCalled();
        });
    });

    describe('popover-header-translation', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThyPopoverModule],
                declarations: [PopoverHeaderTranslationComponent]
            }).compileComponents();
        });

        let fixture: ComponentFixture<PopoverHeaderTranslationComponent>;
        let popoverHeaderElement: HTMLElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(PopoverHeaderTranslationComponent);
            fixture.detectChanges();
            popoverHeaderElement = fixture.debugElement.query(By.directive(ThyPopoverHeaderComponent)).nativeElement;
        });

        it('should create', () => {
            expect(fixture).toBeTruthy();
            expect(popoverHeaderElement).toBeTruthy();
        });

        it('should show thyTitle when popover header only set thyTitleTranslationKey', () => {
            expect(popoverHeaderElement.textContent.includes('Translation Key Title')).toBeTruthy();
        });
    });

    describe('popover-body', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThyPopoverModule],
                declarations: [PopoverBodyBasicComponent]
            });
            TestBed.compileComponents();
        });

        let popoverBasicFixture: ComponentFixture<PopoverBodyBasicComponent>;
        let popoverBodyDebugElement: DebugElement;
        let popoverBodyElement: HTMLElement;

        beforeEach(() => {
            popoverBasicFixture = TestBed.createComponent(PopoverBodyBasicComponent);
            popoverBasicFixture.detectChanges();
            popoverBodyDebugElement = popoverBasicFixture.debugElement.query(By.directive(ThyPopoverBodyComponent));
            popoverBodyElement = popoverBodyDebugElement.nativeElement;
        });

        it('should create', () => {
            expect(popoverBasicFixture).toBeTruthy();
            expect(popoverBodyDebugElement).toBeTruthy();
            expect(popoverBodyElement).toBeTruthy();
        });

        it('should has correct DOM structure and class', () => {
            expect(popoverBodyElement.childElementCount).toEqual(0);
            expect(popoverBodyElement.classList).toContain('thy-popover-body');
        });
    });
});
