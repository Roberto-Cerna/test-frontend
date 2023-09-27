import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpService } from '../service/http.service';
import { LoaderService } from '../service/loader.service';
import { SnackbarService } from '../service/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  constructor(private _formBuilder: FormBuilder,
              private httpService:HttpService,
              private router: Router,
              private loaderService:LoaderService,
              private snackbarService: SnackbarService,
              private route: ActivatedRoute) { 
    localStorage.setItem('libro_reclamaciones_token','')         
  }

  ngOnInit(): void {
    this.loginFormGroup = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  login(){
    this.loaderService.show()
    this.httpService.login(this.loginFormGroup.value).subscribe({
      next : (r:any)=>this.onLogin(r),
      error : () => this.showError()
    })
  }
  showError() {
    this.loaderService.hide()
    this.snackbarService.error('Ocurrio un error. Vuelva a intentarlo.')
  }
  onLogin(r:any){
      this.loaderService.hide()
      localStorage.setItem('libro_reclamaciones_token',r.token)
      this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
        const reclamoId = paramMap.get('reclamo');
        if(reclamoId)
          this.router.navigate(['detalle'],{state : {id:reclamoId}});
        else 
          this.router.navigate(['reporte']);  
      });
  }
}
