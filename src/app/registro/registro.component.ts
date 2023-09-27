import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { environment } from 'src/environments/environment';
import { AddReclamoRequest } from '../entity/reclamo';
import { AddReclamoResponse } from '../entity/reclamo.response';
import { RegistroDialogComponent } from '../registro-dialog/registro-dialog.component';
import { HttpService } from '../service/http.service';
import { LoaderService } from '../service/loader.service';
import { SnackbarService } from '../service/snackbar.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  now=new Date();
  documentTypes=["DNI","CE","Pasaporte"]
  channels=["Correo electrónico"]
  departments:any[]=[]
  provinces:any[]=[]
  districts:any[]=[]

  datosPersonaFormGroup!: FormGroup;
  bienContratadoFormGroup!: FormGroup;
  detalleReclamacionFormGroup!: FormGroup;
  files :File[]=[]

  @ViewChild(MatStepper)
  private stepper!: MatStepper;
  
  constructor(private _formBuilder: FormBuilder,
              private httpService : HttpService,
              private snackbarService:SnackbarService,
              private loaderService:LoaderService,
              public dialog: MatDialog) { 
    this.httpService.listarDepartamentos().subscribe(r=>this.departments=r);
  }

  ngOnInit(): void {
    this.datosPersonaFormGroup = this._formBuilder.group({
      docType: ['', Validators.required],
      docNumber: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      channel: ['', Validators.required],
      department: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      email: ['', [Validators.email,Validators.required]],
      phone: ['', Validators.required],
      apoderado:[''],
      docTypeApoderado: [''],
      docNumberApoderado: [''],
      nameApoderado: [''],
      lastnameApoderado: ['']
    });
    this.datosPersonaFormGroup.get('apoderado')?.valueChanges.subscribe(value => {
        if(value){
          this.datosPersonaFormGroup.get('docTypeApoderado')!.setValidators([Validators.required]);
          this.datosPersonaFormGroup.get('docNumberApoderado')!.setValidators([Validators.required]);
          this.datosPersonaFormGroup.get('nameApoderado')!.setValidators([Validators.required]);
          this.datosPersonaFormGroup.get('lastnameApoderado')!.setValidators([Validators.required]);
        }else{
          this.datosPersonaFormGroup.get('docTypeApoderado')!.clearValidators();
          this.datosPersonaFormGroup.get('docNumberApoderado')!.clearValidators();
          this.datosPersonaFormGroup.get('nameApoderado')!.clearValidators();
          this.datosPersonaFormGroup.get('lastnameApoderado')!.clearValidators();
        }
        this.datosPersonaFormGroup.get('docTypeApoderado')!.updateValueAndValidity();
        this.datosPersonaFormGroup.get('docNumberApoderado')!.updateValueAndValidity();
        this.datosPersonaFormGroup.get('nameApoderado')!.updateValueAndValidity();
        this.datosPersonaFormGroup.get('lastnameApoderado')!.updateValueAndValidity();
    });
    this.bienContratadoFormGroup = this._formBuilder.group({
      type: ['', Validators.required],
      amount: ['', Validators.required],
      brand: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.detalleReclamacionFormGroup = this._formBuilder.group({
      claimType: ['', Validators.required],
      claimDetail: ['', Validators.required],
      claimOrder: ['', Validators.required]
    });
  }
  addFile(event:any){
    if((event.target.files[0].size/1024/1024)>environment.maxsize_files){
      this.snackbarService.error("Tamaño de archivo excedido:"+environment.maxsize_files+" MB");
      return;
    }
    this.files.push(event.target.files[0])
  }
  openFile(file:File){
    //var win =window.open(file, "_blank");
    //win.focus();
  }
  deleteFile(file:File,sequence:number){
    this.files.splice(sequence,1)
  }
  onStepChange($event:any){
    if($event.selectedIndex==1)this.scrollToSectionHook($event.selectedIndex,'step2');
    else if($event.selectedIndex==2)this.scrollToSectionHook($event.selectedIndex,'step3');
  }
  private scrollToSectionHook(index:number,stepId:string) { 
    const stepElement = document.getElementById(stepId);
    if (stepElement) {
      setTimeout(() => {
        stepElement.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      }, 250);
    }
  }
  save(){
    this.loaderService.show();
    this.httpService.agregarReclamo(this.buildRequest()).subscribe(r=>this.enviarfotos(r))
  }
  enviarfotos(response: AddReclamoResponse): void {
    if(this.files.length>0){
      this.httpService.agregarDocumento(response.id,this.files).subscribe({
        complete : ()=> this.onFotosEnviadas(response),
        error : e=> {this.snackbarService.error(e),this.loaderService.hide()}
      })
    }else this.onFotosEnviadas(response)
  }
  onFotosEnviadas(r:AddReclamoResponse){
    this.httpService.enviarEmail(r.id,"1").subscribe()
    this.httpService.enviarEmail(r.id,"2").subscribe()
    this.loaderService.hide()
    const dialogRef = this.dialog.open(RegistroDialogComponent,{data:{response:r,email:this.datosPersonaFormGroup.value.email},hasBackdrop : true});
    dialogRef.afterClosed().subscribe(result => {
      this.files=[]  
      this.provinces=this.districts=[]
      this.httpService.listarDepartamentos().subscribe(r=>this.departments=r);
      this.stepper.reset()
      this.datosPersonaFormGroup.reset()
      this.detalleReclamacionFormGroup.reset()
      this.bienContratadoFormGroup.reset()
    });
  }
  buildRequest() {
    var request:AddReclamoRequest={
      tipoDoc: this.datosPersonaFormGroup.value.docType,
      numeroDoc: this.datosPersonaFormGroup.value.docNumber,
      nombres: this.datosPersonaFormGroup.value.name,
      apellidos: this.datosPersonaFormGroup.value.lastname,
      medioRespuesta: this.datosPersonaFormGroup.value.channel,
      direccion: this.datosPersonaFormGroup.value.address,
      departmento: this.datosPersonaFormGroup.value.department.nombre,
      provincia: this.datosPersonaFormGroup.value.province.nombre,
      distrito: this.datosPersonaFormGroup.value.district.nombre,
      email: this.datosPersonaFormGroup.value.email,
      telefono: this.datosPersonaFormGroup.value.phone,
      apoderadoTipoDoc: this.datosPersonaFormGroup.value.docTypeApoderado,
      apoderadoNumeroDoc: this.datosPersonaFormGroup.value.docNumberApoderado,
      apoderadoNombres: this.datosPersonaFormGroup.value.nameApoderado,
      apoderadoApellidos: this.datosPersonaFormGroup.value.lastnameApoderado,
      
      tipoBien: this.bienContratadoFormGroup.value.type,
      monto: this.bienContratadoFormGroup.value.amount,
      marca: this.bienContratadoFormGroup.value.brand,
      descripcion: this.bienContratadoFormGroup.value.description,

      tipoReclamo: this.detalleReclamacionFormGroup.value.claimType,
      detalle: this.detalleReclamacionFormGroup.value.claimDetail,
      pedidoConsumidor: this.detalleReclamacionFormGroup.value.claimOrder,
      numFiles: this.files.length
    }
    return request
  }
  onChangeDepartment(department:any){
    this.httpService.listarProvincia(department.id).subscribe(r=>this.provinces=r)
  }
  onChangeProvince(province:any){
    this.httpService.listarDistritos(this.datosPersonaFormGroup.value.department.id,province.id).subscribe(r=>this.districts=r)
  }
  reset(){
    this.files=[]
    this.datosPersonaFormGroup.reset()
    this.bienContratadoFormGroup.reset()
    this.detalleReclamacionFormGroup.reset()
  }
  secondStep(){
    if(!this.datosPersonaFormGroup.valid)
      this.snackbarService.error('Debe completar los campos para poder pasar al siguiente paso.')
  }
  thirdStep(){
    if(!this.bienContratadoFormGroup.valid)
      this.snackbarService.error('Debe completar los campos para poder pasar al siguiente paso.')
  }
  openTerminosDialog(){
    window.open('https://storagecompendio.blob.core.windows.net/vah/Términos y Condiciones.pdf','_blank')
  }
  openPoliticaDialog(){
    window.open('https://storagecompendio.blob.core.windows.net/vah/Política de Privacidad.pdf','_blank')
  }
}
