import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment'
import { AddReclamoRequest, Reclamo } from '../entity/reclamo';
import { AddReclamoResponse } from '../entity/reclamo.response';
import { Router } from '@angular/router';

@Injectable()
export class HttpService{
    baseUrl : string
    constructor(private http:HttpClient,private router: Router) {
        this.baseUrl=environment.baseUrl;
    }
    agregarReclamo(request:AddReclamoRequest):Observable<AddReclamoResponse>{
        return <Observable<any>> this.http.post(`${this.baseUrl}`+'/reclamos/',request).pipe(
            tap(data => data),
            catchError(this.handleError));
    }
    agregarDocumento(idReclamo:number,files:File[]){
        let formData = new FormData();
        files.forEach(f=>formData.append('files',f));
        let params = new HttpParams();
        const options = {
            params: params,
            reportProgress: false,
        };
        const req = new HttpRequest('POST', `${this.baseUrl}`+'/reclamos/'+idReclamo+'/documentos', formData, options);
        return this.http.request(req);
    }
    listarDepartamentos(){
        return <Observable<any>> this.http.get(`${this.baseUrl}`+'/ubigeo/departamentos').pipe(
            tap(data => data),
            catchError(this.handleError));
    }
    listarProvincia(departamento:string){
        return <Observable<any>> this.http.get(`${this.baseUrl}`+'/ubigeo/departamentos/'+departamento+'/provincias').pipe(
            tap(data => data),
            catchError(this.handleError));
    }
    listarDistritos(departamento:string,provincia:string){
        return <Observable<any>> this.http.get(`${this.baseUrl}`+'/ubigeo/departamentos/'+departamento+'/provincias/'+provincia+'/distritos').pipe(
            tap(data => data),
            catchError(this.handleError));
    }
    getPdf(idReclamo:number) {
        const headers = new HttpHeaders();
        headers.append('Accept', 'application/pdf');
        return this.http.get( `${this.baseUrl}`+'/reclamos/'+idReclamo+'/pdf',{headers:headers,observe: 'response',responseType: 'blob'});
    }
    login(request:any){
        return <Observable<any>> this.http.post(`${this.baseUrl}`+'/login',request).pipe(
            tap((data: any) => data),
            catchError(this.handleError));  
    }
    listarReclamos(request:any):Observable<Reclamo[]> {
        const headers = this.buildAuthHeader()
        return <Observable<Reclamo[]>>this.http.post( `${this.baseUrl}/reporte/reclamos`,request,{headers:headers}).pipe(
            tap((data: any) => data),
            catchError(this.handleError));
    }
    contarReclamos(request:any):Observable<number> {
        const headers = this.buildAuthHeader()
        return <Observable<number>>this.http.post( `${this.baseUrl}/reporte/reclamos/count`,request,{headers:headers}).pipe(
            tap((data: any) => data),
            catchError(this.handleError));;
    }
    obtenerReclamo(id:number):Observable<Reclamo>{
        const headers = this.buildAuthHeader()
        return <Observable<Reclamo>>this.http.get( `${this.baseUrl}/reporte/reclamos/`+id,{headers:headers}).pipe(
            tap((data: any) => data),
            catchError(this.handleError));; 
    }
    responderReclamo(id:number,request:any):Observable<Reclamo>{
        const headers = this.buildAuthHeader()
        return <Observable<Reclamo>>this.http.put( `${this.baseUrl}/reporte/reclamos/`+id,request,{headers:headers}).pipe(
            tap((data: any) => data),
            catchError(x=>this.handleError(x)));
    }
    enviarEmail(id:number,type:String){
        //const headers = this.buildAuthHeader()
        return this.http.get( `${this.baseUrl}/reclamos/`+id+'/email?type='+type).pipe(
            tap((data: any) => data),
            catchError(x=>this.handleError(x)));
    }
    agregarDocumentoRespuesta(idReclamo:number,files:File[]){
        const headers = this.buildAuthHeader()
        let formData = new FormData();
        files.forEach(f=>formData.append('files',f));
        let params = new HttpParams();
        const options = {
            params: params,
            reportProgress: false,
            headers : headers
        };
        const req = new HttpRequest('POST', `${this.baseUrl}`+'/reporte/reclamos/'+idReclamo+'/documentos', formData, options,);
        return this.http.request(req);
    }
    buildAuthHeader() {
        let token=localStorage.getItem('libro_reclamaciones_token')
        const headers=new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return headers;
    }
    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if(err.status==401){
            localStorage.setItem('libro_reclamaciones_token','')
            //this.router.navigate(['login']);
            return throwError('Por favor inicie sesion nuevamente.'); 
        }
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }
}