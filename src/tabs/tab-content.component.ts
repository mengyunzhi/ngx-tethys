import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * @private
 */
@Component({
    selector: 'thy-tab-content, [thyTabContent]',
    exportAs: 'thyTabContent',
    preserveWhitespaces: false,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (active) {
            <ng-template [ngTemplateOutlet]="content"></ng-template>
        }
    `,
    host: {
        class: 'thy-tab-content',
        '[attr.aria-hidden]': '!active',
        '[attr.tabindex]': 'active ? 0 : -1',
        '[style.visibility]': 'tabPaneAnimated ? active ? null : "hidden" : null',
        '[style.height]': 'tabPaneAnimated ? active ? null : 0 : null',
        '[style.overflow-y]': 'tabPaneAnimated ? active ? null : "none" : null',
        '[style.display]': '!tabPaneAnimated ? active ? null : "none" : null'
    },
    imports: [NgTemplateOutlet]
})
export class ThyTabContent {
    @Input() content: TemplateRef<void> | null = null;

    @Input() active = false;

    @Input() tabPaneAnimated = true;
}
