import { Component } from '@angular/core';
import { ComponentFixture, waitForAsync, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { dispatchMouseEvent } from 'ngx-tethys/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ThySharedModule } from 'ngx-tethys/shared';

@Component({
    selector: 'thy-drag-drop-test',
    template: `
        <div cdkDropList thyDragDrop class="list">
            <div class="item1" cdkDrag>item1</div>
            @if (showItem2) {
                <div class="item2" cdkDrag>item2</div>
            }
        </div>
    `,
    imports: [ThySharedModule, DragDropModule]
})
class ThyDragDropTestComponent {
    showItem2 = false;
}

describe('thy-drag-drop', () => {
    let fixture: ComponentFixture<ThyDragDropTestComponent>;
    let testComponent: ThyDragDropTestComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({});
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ThyDragDropTestComponent);
        testComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should has correct class in list when drag item', fakeAsync(() => {
        const item = fixture.debugElement.query(By.css('.item1')).nativeElement;
        expect(document.body.classList).not.toContain('thy-dragging-body');
        dispatchMouseEvent(item, 'mousedown');
        dispatchMouseEvent(document, 'mousemove', 150, 100);
        fixture.detectChanges();
        expect(document.body.classList).toContain('thy-dragging-body');
        dispatchMouseEvent(document, 'mouseup');
        fixture.detectChanges();
        expect(document.body.classList).not.toContain('thy-dragging-body');
    }));

    it('should has correct class in list when add a draggable item and drag it', fakeAsync(() => {
        testComponent.showItem2 = true;
        fixture.detectChanges();
        const item = fixture.debugElement.query(By.css('.item2'));

        expect(document.body.classList).not.toContain('thy-dragging-body');

        dispatchMouseEvent(item.nativeElement, 'mousedown');
        dispatchMouseEvent(document, 'mousemove', 150, 100);
        fixture.detectChanges();
        expect(document.body.classList).toContain('thy-dragging-body');

        dispatchMouseEvent(document, 'mouseup');
        fixture.detectChanges();
        expect(document.body.classList).not.toContain('thy-dragging-body');
    }));
});
