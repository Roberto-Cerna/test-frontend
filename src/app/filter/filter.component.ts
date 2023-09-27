import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
//import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { startWith, map } from 'rxjs/operators';
import { FilterInput, FilterOutput, FilterType } from '../entity/filter';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() options! : FilterInput[];
  @Input() initialValues! : FilterOutput[];
  @Output() onChange = new EventEmitter<FilterOutput[]>();
  
  filteredOptions!: Observable<FilterInput[]>;
  searchCtrl = new FormControl();
  @ViewChild('searchInput', {static: false}) searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete!: MatAutocomplete;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSearch!: Observable<FilterOutput[]>;
  searches: FilterOutput[] =[];
  allSearch!: FilterOutput[];
  disabled = false;
  
  constructor(private dialog:MatDialog,
            private datePipe: DatePipe) { 
    if(this.initialValues)this.searches=this.initialValues;
  }

  ngOnInit() {

  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    const name: SimpleChange = changes['options'];
    if(name){
      this.options=name.currentValue;
      this.filteredOptions = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.searchCtrl.setValue('');
    }
    const initial: SimpleChange = changes['initialValues'];
    if(initial){
      this.searches=initial.currentValue;
    }
  }
  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.chipInput?.inputElement;
      const value = event.value;
      if ((value || '').trim()) {
        //this.searches.push();
      }
      if (input) {
        input.value = '';
      }
      this.searchCtrl.setValue(null);
    }
  }
  remove(search: FilterOutput): void {
    const index = this.searches.indexOf(search);
    if (index >= 0) {
      this.searches.splice(index, 1);
      this.searchCtrl.setValue('');
      this.onChange.emit(this.searches);
    }
  }
  clicked(search : FilterOutput){
    if(search.filter.type!=FilterType.plane){
      this.dialogOpen=true;
      //const target = new ElementRef(event.source);
      var dialog=FilterDialogComponent; 
      //if(search.filter.type!=FilterType.customGroup && search.filter.type!=FilterType.customActivity) dialog=FilterDialogComponent;
      //else if (search.filter.type==FilterType.customActivity) dialog=FilterActivityDialog;
      //else dialog=FilterGroupDialog;

      const dialogRef = this.dialog.open(dialog, {
        data: {filter: search.filter},hasBackdrop : true,disableClose:false
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        this.dialogOpen=false;
        if( result!=null && result!='' ){
          if(search.filter.type!=FilterType.customGroup && search.filter.type!=FilterType.customActivity){
            let filter=result;
            let name =result;
            if(search.filter.type==FilterType.dates){
              let dates= result.split("|");
              if(dates.length>1){
                let startDate=new Date(dates[0]);
                let endDate=new Date(dates[1]); 
                name=filter=this.datePipe.transform(startDate, 'dd/MM/yyyy')+'-'+this.datePipe.transform(endDate, 'dd/MM/yyyy');
                result=name;  
              }else{
                if(filter=="last7days") name="Ultimos 7 dias";
                if(filter=="lastmonth") name="Ultimo mes";
                if(filter=="last3month") name="Ultimos 3 meses";
              }
              //search={filter:search.filter,name:search.filter.name+':'+name ,search:result};
              search.name=search.filter.name+':'+name;
              search.search=result;
              //this.searches.push({filter:event.option.value,name:event.option.value.name+':'+name ,search:result}); 
            }else if(search.filter.type==FilterType.list){
              //search={filter:search.filter,name:search.filter.name+':'+result.name ,search:result};
              search.name=search.filter.name+':'+result.name;
              search.search=result;
              //this.searches.push({filter:event.option.value,name:event.option.value.name+':'+result.name ,search:result});
            }else{
              //search={filter:search.filter,name:search.filter.name+':'+result ,search:result};
              search.name=search.filter.name+':'+result;
              search.search=result;
              //this.searches.push({filter:event.option.value,name:event.option.value.name+':'+result,search:result});
            }
          }else if (search.filter.type==FilterType.customGroup){
            //search={filter:search.filter,name:search.filter.name+':'+result[0].labelesult ,search:result[0]};
            //console.log(result);
            search.name=search.filter.name+':'+result[0].label;
            search.search=result[0];
            //this.searches.push({filter:event.option.value,name:event.option.value.name+':'+result[0].label ,search:result[0]});  
          }else if (search.filter.type==FilterType.customActivity){
            search.name=search.filter.name+':'+result.name;
            search.search=result;  
          }
          this.onChange.emit(this.searches);
        }
      });
    }else{
      search={filter:search.filter,name:search.filter.name,search:search.filter.name};
      search.name=search.filter.name;
      search.search=search.filter.name;
      //this.searches.push({filter:event.option.value,name:event.option.value.name,search:event.option.value.name});  
      this.onChange.emit(this.searches);     
    }
  }
  //private readonly triggerElementRef!: ElementRef;
  dialogOpen=false;
  selected(event: MatAutocompleteSelectedEvent): void {
    this.searchInput.nativeElement.value = '';
    this.searchCtrl.setValue(null);
    if(event.option.value.type!=FilterType.plane){
      this.dialogOpen=true;
      //const target = new ElementRef(event.source);
      var dialog=FilterDialogComponent; 
      //if(event.option.value.type!=FilterType.customGroup && event.option.value.type!=FilterType.customActivity) dialog=FilterDialogComponent;
      //else if(event.option.value.type==FilterType.customActivity) dialog=FilterActivityDialog
      //else dialog=FilterGroupDialog;

      const dialogRef = this.dialog.open(dialog, {
        data: {filter: event.option.value},hasBackdrop : true,disableClose:false
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        this.dialogOpen=false;

        if( result!=null && result!='' ){
          if(event.option.value.type!=FilterType.customGroup){
            let filter=result;
            let name =result;
            if(event.option.value.type==FilterType.dates){
              let dates= result.split("|");
              if(dates.length>1){
                let startDate=new Date(dates[0]);
                let endDate=new Date(dates[1]); 
                name=filter=this.datePipe.transform(startDate, 'dd/MM/yyyy')+'-'+this.datePipe.transform(endDate, 'dd/MM/yyyy');
                result=name;  
              }else{
                if(filter=="last7days") name="Ultimos 7 dias";
                if(filter=="lastmonth") name="Ultimo mes";
                if(filter=="last3month") name="Ultimos 3 meses";
              }
              this.searches.push({filter:event.option.value,name:event.option.value.name+':'+name ,search:result}); 
            }else if(event.option.value.type==FilterType.list || event.option.value.type==FilterType.customActivity ){
              this.searches.push({filter:event.option.value,name:event.option.value.name+':'+result.name ,search:result});
            }else{
              this.searches.push({filter:event.option.value,name:event.option.value.name+':'+result,search:result});
            }
          }else{
            this.searches.push({filter:event.option.value,name:event.option.value.name+':'+result[0].label ,search:result[0]});  
          }
          this.onChange.emit(this.searches);
        }
        
        this.searchInput.nativeElement.value = '';
        this.searchCtrl.setValue('');
        this.searchInput.nativeElement.blur();
        this.searchCtrl.reset();
      });
    }else{
      this.searches.push({filter:event.option.value,name:event.option.value.name,search:event.option.value.name});  
      this.onChange.emit(this.searches);     
    }
  }
  private _filter(value:any): FilterInput[] {
    if(!this.dialogOpen && value==null && this.searches.length<=0) return this.options;
    if(this.dialogOpen || this.searches.filter(search=>search.filter.type==FilterType.id).length>0 || value==null) return [];
    const filterValue = value && !value.name?(value.type? value.name.toLowerCase():value.toLowerCase()):'';
    if(this.searches.length>0){
      return this.options.filter(option => option.type!=FilterType.id && option.name.toLowerCase().includes(filterValue) && (this.searches.filter(search=>search.filter.name==option.name).length==0));
    }else{ 
      return this.options.filter(option => option.name.toLowerCase().includes(filterValue) && (this.searches.filter(search=>search.filter==option).length==0));
    }
  }
  onFocus(){
    if(this.searches.length>0)this.searchCtrl.setValue('');;
  }
}
