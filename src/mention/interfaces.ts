import { Observable } from 'rxjs';

import { TemplateRef } from '@angular/core';

export interface MentionDefaultDataItem {
    name?: string;
}

export interface Mention<T = unknown> {
    trigger: string;
    data: T[];
    suggestionsTemplateRef?: TemplateRef<{ data: T[] }>;
    limit?: number;
    // content not found closed auto
    autoClose?: boolean;
    popoverClass?: string;
    displayTemplateRef?: TemplateRef<T>;
    emptyText?: string;
    insertTransform?: (item: T) => string;
    search?: (term: string, items?: T[]) => T[] | Observable<T[]>;
}

export interface MentionSuggestionSelectEvent<T = any> {
    event: Event;
    item: T;
}
