import { Component } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss'
})
export class DialogAddPlayerComponent {
  name : string = '';

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>){ }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
