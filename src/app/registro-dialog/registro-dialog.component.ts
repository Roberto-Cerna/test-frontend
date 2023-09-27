import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddReclamoResponse } from '../entity/reclamo.response';

import { DatePipe } from '@angular/common';
import { HttpService } from '../service/http.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-registro-dialog',
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.scss']
})
export class RegistroDialogComponent implements OnInit {
  now=new Date()
  email:string
  response:AddReclamoResponse
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
              private datePipe:DatePipe,
              private httpService:HttpService) { 
    this.email=data.email
    this.response=data.response
  }
  ngOnInit(): void {
  }
  puedeImprimir=true
  imprimir(){
    if(this.puedeImprimir){
      this.puedeImprimir=false
      this.httpService.getPdf(this.response.id).subscribe(r=>this.saveToFileSystem(r))
    }
  }
  saveToFileSystem(response:any) {
    var filename='reclamacion-'+(("00000" + this.response.id).slice(-5))+'-'+this.datePipe.transform(this.now,'yyyy')+'.pdf';
    const blob = new Blob([response.body], {type: 'application/pdf'});
    saveAs(blob, filename);
    this.puedeImprimir=true
  }
}


