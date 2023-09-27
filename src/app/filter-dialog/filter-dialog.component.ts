import { Component, Inject, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterInput, FilterInputDetail, FilterType } from '../entity/filter';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  result:any
  idType:FilterType=FilterType.id;
  datesType:FilterType=FilterType.dates;
  nameType:FilterType=FilterType.name;
  listType:FilterType=FilterType.list;
  rangeDateType:FilterType=FilterType.rangeDate;
  private readonly _matDialogRef: MatDialogRef<FilterDialogComponent>;
  filteredOptions!: Observable<FilterInputDetail[]>;
  searchCtrl = new FormControl();
  startDate! : Date;
  endDate! : Date;
  //private readonly triggerElementRef: ElementRef;
  themeColor: string='primary';
  private message! : String;
  isDateFilter:boolean;
  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      //console.log(data);
      this._matDialogRef = dialogRef;
      //this.isDateFilter=(data.filter.type==FilterType.dates);
      this.isDateFilter=(data.filter.type==FilterType.rangeDate);
      //this.triggerElementRef = data.trigger;
  }
  ngOnInit() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    //const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    //matDialogConfig.position = { left: `${rect.left}px`, top: `${rect.bottom - 50}px` };
    //matDialogConfig.position = { left: '300px', top: '260px' };
    matDialogConfig.width = '400px';
    matDialogConfig.height = this.getHeigth();
    //this._matDialogRef.addPanelClass('custom-dialog') ; 
    this._matDialogRef.updateSize(matDialogConfig.width, matDialogConfig.height);
    this._matDialogRef.updatePosition(matDialogConfig.position);

    this.filteredOptions = this.searchCtrl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  
  cancel(): void {
    console.log('cancel');
    this.dialogRef.close();
  }
  getHeigth():string{
    if(this.data.filter.type==FilterType.id || this.data.filter.type==FilterType.name) return '250px';
    if(this.data.filter.type==FilterType.dates) return '320px';
    if(this.data.filter.detail.length==1) return '250px';
    if(this.data.filter.detail.length==4) return '270px';
    if(this.data.filter.detail.length>4) return '350px';
    return '250px'
  }
  private _filter(value:any ): FilterInputDetail[] {
    //console.log(value);
    const filterValue = value?value.toLowerCase():'';
    return this.data.filter.detail.filter((option:any) => option.name.toLowerCase().includes(filterValue));
  }
}
export interface DialogData {
  filter : FilterInput
}
