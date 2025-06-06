import { ThyMessageService } from 'ngx-tethys/message';
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ThySpace, ThySpaceItemDirective } from 'ngx-tethys/space';
import { ThyButton } from 'ngx-tethys/button';

@Component({
    selector: 'thy-message-custom-content-example',
    templateUrl: './custom-content.component.html',
    imports: [ThySpace, ThySpaceItemDirective, ThyButton]
})
export class ThyMessageCustomContentExampleComponent implements OnInit {
    private messageService = inject(ThyMessageService);

    @ViewChild('content', { static: true }) contentTemplate: TemplateRef<any>;

    ngOnInit() {}

    showWithString() {
        this.messageService.success('content is string！');
    }

    showWithTemplateRef() {
        this.messageService.success(this.contentTemplate);
    }

    openAction = () => {
        alert('Hello World');
    };
}
