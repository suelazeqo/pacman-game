import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html',
  styleUrls: ['./popup-dialog.component.css']
})
export class PopupDialogComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }
  username: string = '';

  submit() {
    // Handle the form submission here
  }

  @Input() visible: boolean = false;

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
