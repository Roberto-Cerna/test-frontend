import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DatePipe } from '@angular/common';
import { Reclamo } from '../entity/reclamo';

@Component({
  selector: 'app-respuesta-dialog',
  templateUrl: './respuesta-dialog.component.html',
  styleUrls: ['./respuesta-dialog.component.scss']
})
export class RespuestaDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public reclamo:Reclamo) { }

  ngOnInit(): void {
  }
}
