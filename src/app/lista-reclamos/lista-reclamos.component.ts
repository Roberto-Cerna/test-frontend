import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, tap } from 'rxjs';
import { FilterOutput, FilterType } from '../entity/filter';
import { Reclamo } from '../entity/reclamo';
import { HttpService } from '../service/http.service';
import { ReclamoDataSource } from '../service/reclamo.datasource';

@Component({
  selector: 'app-lista-reclamos',
  templateUrl: './lista-reclamos.component.html',
  styleUrls: ['./lista-reclamos.component.scss']
})
export class ListaReclamosComponent implements OnInit {
  displayedColumns= ["id", "numdoc","fecha","action"];
  options= [{name:'Id',type:FilterType.name,detail:[]},{name:"Numero documento",type:FilterType.name,detail:[]}]
  searches:FilterOutput[]=[];
  answered=false
  dataSource : ReclamoDataSource
  constructor(private httpService:HttpService,
              private router: Router,) { 
    this.dataSource = new ReclamoDataSource(this.httpService);
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    //merge(this.sort.sortChange, this.paginator.page)
    this.paginator.page
    .pipe(
        tap(() => this.loadReclamosPage())
    ).subscribe();
    setTimeout(()=>{this.loadReclamosPage();}, 100);
  }
  loadReclamosPage(): void {
    var id=this.searches.filter(search=>search.filter.name==this.options[0].name).length>0?+this.searches.filter(search=>search.filter.name==this.options[0].name)[0].search:-1;
    var docNumber=this.searches.filter(search=>search.filter.name==this.options[1].name).length>0?+this.searches.filter(search=>search.filter.name==this.options[1].name)[0].search+'':'';
    this.dataSource.list(id,docNumber,this.answered,this.paginator.pageIndex,this.paginator.pageSize)
  }
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  onChange(selection : FilterOutput[]) {
    this.searches=selection;
    this.paginator.pageIndex = 0;
    this.loadReclamosPage();
  }
  onTabChanged($event:any){
    this.answered=$event.index==1
    this.paginator.pageIndex = 0;
    this.loadReclamosPage();
  }
  edit(reclamo : Reclamo){
    this.router.navigate(['detalle'],{state:reclamo});
  }
}
