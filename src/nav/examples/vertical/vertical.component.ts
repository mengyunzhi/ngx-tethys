import { Component, OnInit } from '@angular/core';
import { ThyNav, ThyNavItemDirective } from 'ngx-tethys/nav';

@Component({
    selector: 'thy-nav-vertical-example',
    templateUrl: './vertical.component.html',
    styleUrls: ['./vertical.component.scss'],
    imports: [ThyNav, ThyNavItemDirective]
})
export class ThyNavVerticalExampleComponent implements OnInit {
    public activeIndex = 0;

    public navList = [
        { index: 0, name: '导航一' },
        { index: 1, name: '导航二' },
        { index: 2, name: '导航三' }
    ];

    constructor() {}

    ngOnInit(): void {}
}
