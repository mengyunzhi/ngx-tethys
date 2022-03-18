import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'thy-image-content',
    template: `
        <div style="width: 400px; height: 400px; background: #fff;">
            <div>image-content</div>
        </div>
    `
})
export class ThyImageContentComponent implements OnInit {
    ngOnInit(): void {
        console.log(11111, 'image content init');
    }
}
