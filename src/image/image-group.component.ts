import { ChangeDetectionStrategy, Component, ViewEncapsulation, Injector, ElementRef, inject } from '@angular/core';
import { IThyImageDirective, IThyImageGroupComponent, THY_IMAGE_GROUP_COMPONENT } from './image.token';

/**
 * 图片分组，提供 thyImageGroup 指令和 thy-image-group 标签两种使用方式
 * @name thy-image-group,[thyImageGroup]
 */
@Component({
    selector: 'thy-image-group, [thyImageGroup]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: THY_IMAGE_GROUP_COMPONENT,
            useClass: ThyImageGroup
        }
    ]
})
export class ThyImageGroup implements IThyImageGroupComponent {
    injector = inject(Injector);

    element = inject(ElementRef);

    images: IThyImageDirective[] = [];

    addImage(image: IThyImageDirective, index: number): void {
        this.images.splice(index, 0, image);
    }

    removeImage(index: number) {
        this.images.splice(index, 1);
    }
}
