import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistroComponent } from './registro/registro.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import { HttpService } from './service/http.service';
import { HttpClientModule } from '@angular/common/http';
import { SnackbarService } from './service/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SpinnerComponent } from './spinner/spinner.component';
import { ListaReclamosComponent } from './lista-reclamos/lista-reclamos.component';
import { RespuestaReclamosComponent } from './respuesta-reclamos/respuesta-reclamos.component';
import { RegistroDialogComponent } from './registro-dialog/registro-dialog.component';
import { RespuestaDialogComponent } from './respuesta-dialog/respuesta-dialog.component';
import { DatePipe } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    SpinnerComponent,
    ListaReclamosComponent,
    RespuestaReclamosComponent,
    RegistroDialogComponent,
    FilterComponent,
    FilterDialogComponent,
    RespuestaDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressBarModule
  ],
  providers: [HttpService,SnackbarService,DatePipe],
  bootstrap: [AppComponent],
  entryComponents : [RegistroDialogComponent,RespuestaDialogComponent]
})
export class AppModule { }
