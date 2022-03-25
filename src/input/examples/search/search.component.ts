import { Component, OnInit } from '@angular/core';
import { InputSize } from 'ngx-tethys/input';

@Component({
    selector: 'thy-input-search-example',
    templateUrl: './search.component.html'
})
export class ThyInputSearchExampleComponent implements OnInit {
    public searchText = '';

    constructor() {}

    ngOnInit() {}

    public change() {
        console.log(this.searchText);
    }
}
