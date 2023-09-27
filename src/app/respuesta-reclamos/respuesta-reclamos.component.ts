import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Documento, Reclamo } from '../entity/reclamo';
import { RespuestaDialogComponent } from '../respuesta-dialog/respuesta-dialog.component';
import { HttpService } from '../service/http.service';
import { LoaderService } from '../service/loader.service';
import { SnackbarService } from '../service/snackbar.service';

@Component({
  selector: 'app-respuesta-reclamos',
  templateUrl: './respuesta-reclamos.component.html',
  styleUrls: ['./respuesta-reclamos.component.scss']
})
export class RespuestaReclamosComponent implements OnInit {
  urlDownloadFile=environment.baseUrl+'/documentos/'
  now=new Date()
  templateCount = [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
    '<svg width="25" height="25" viewBox="0 0 200 200" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1">',
    '<circle style="fill:{{ fillColor }};fill-opacity:1;fill-rule:evenodd;stroke:#ccc;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" cx="100" cy="100" r="95" />',
    '<text xml:space="preserve" style="font-style:normal;font-weight:bold;font-size:90.42481995px;line-height:125%;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" x="50%" y="65%" sodipodi:linespacing="125%"><tspan  sodipodi:role="line"   style="text-anchor:middle;text-align:center">{{ countNumber }}</tspan></text>',
    '</svg>'
  ].join('\n');
  reclamo : Reclamo
  respuestaFormGroup!: FormGroup;
  files :File[]=[]
  constructor(private domSanitizer: DomSanitizer,
              private httpService : HttpService,
              private _formBuilder: FormBuilder,
              private router:Router,
              private snackbarService:SnackbarService,
              private loaderService:LoaderService,
              public dialog: MatDialog) { 
    this.reclamo=history.state;
    if(!this.reclamo.id){
      this.goList()
      return;
    }
  }
  ngOnInit(): void {
    this.loaderService.show()
    this.httpService.obtenerReclamo(this.reclamo.id).subscribe({
      next  :   r=>{this.loaderService.hide();this.reclamo=r},
      error :  ()=>{this.loaderService.hide();this.snackbarService.error('Ocurrio un error');}
    })
    this.respuestaFormGroup = this._formBuilder.group({
      respuesta: ['', Validators.required]
    });
  }
  getIcon(color: string, i: number) {
    var svgFinal;
    svgFinal=this.templateCount.replace('{{ countNumber }}', i+"").replace('{{ fillColor }}',color);
    var base64SVG = 'data:image/svg+xml;base64,' + btoa(svgFinal)
    return this.domSanitizer.bypassSecurityTrustResourceUrl(base64SVG) 
  }
  filter(documentos:Documento[],tipo:string):Documento[]{
    return documentos && documentos.length>0?documentos.filter(d=>d.tipo==tipo):[]
  }
  addFile(event:any){
    if((event.target.files[0].size/1024/1024)>environment.maxsize_files){
      this.snackbarService.error("Tamaño de archivo excedido:"+environment.maxsize_files+" MB");
      return;
    }
    this.files.push(event.target.files[0])
  }
  deleteFile(file:File,sequence:number){
    this.files.splice(sequence,1)
  }
  save(){
    this.loaderService.show()
    this.httpService.responderReclamo(this.reclamo.id,this.respuestaFormGroup.value).subscribe({
      complete:()=> this.enviarfotos(this.reclamo)
    })
  }
  enviarfotos(reclamo: Reclamo): void {
    if(this.files.length>0){
      this.httpService.agregarDocumentoRespuesta(this.reclamo.id,this.files).subscribe({
        complete : ()=> this.onFotosEnviadas(),
        error : e=> {this.snackbarService.error(e),this.loaderService.hide()}
      })
    }else this.onFotosEnviadas()
  }
  onFotosEnviadas(){
    this.httpService.enviarEmail(this.reclamo.id,"3").subscribe()
    this.loaderService.hide()
    const dialogRef = this.dialog.open(RespuestaDialogComponent,{data:this.reclamo,hasBackdrop : true});
    dialogRef.afterClosed().subscribe(result => {
      this.goList()
    });
  }
  goList(){
    this.router.navigate(['reporte']);
  }
}
