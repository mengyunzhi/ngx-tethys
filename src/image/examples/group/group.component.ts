import { Component } from '@angular/core';

@Component({
    selector: 'thy-image-group-example',
    templateUrl: './group.component.html'
})
export class ThyImageGroupExampleComponent {
    images = [
        {
            src: 'assets/images/image/first.png',
            imageMeta: {
                name: 'first.jpg',
                size: '66kb'
            },
            origin: {
                src: 'assets/images/image/first.png'
            }
        },
        {
            src: 'assets/images/image/second.png',
            imageMeta: {
                name: 'last.jpg',
                size: '44kb'
            },
            origin: {
                src: 'assets/images/image/second.png'
            }
        },
        {
            src: 'assets/images/image/last.png',
            imageMeta: {
                name: 'last.jpg',
                size: '44kb'
            },
            origin: {
                src: 'assets/images/image/last.png'
            }
        }
    ];
}
