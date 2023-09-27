import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { Reclamo } from "../entity/reclamo";
import { HttpService } from "./http.service";

export class ReclamoDataSource implements DataSource<Reclamo> {
    private reclamosSubject = new BehaviorSubject<Reclamo[]>([]);
    public loadingSubject = new BehaviorSubject<boolean>(false);
    public totalSubject = new BehaviorSubject<number>(0);
    constructor(private httpService: HttpService) {
    }
    public loading$ = this.loadingSubject.asObservable();
    public data: Reclamo[]=[];
    list(id:number,
        docNumber:string,
        answered : boolean,
        //sortBy:string,    
        //sortDirection:string,
        page:number,
        pageSize:number) {
        this.loadingSubject.next(true);
        var request={id,docNumber,answered,page,pageSize}
        this.httpService.listarReclamos(request)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(responses => this.reclamosSubject.next(responses));
        this.httpService.contarReclamos(request)
            .pipe(
                catchError(() => of(0))
            )
            .subscribe(total => this.totalSubject.next(total));
    }
    connect(collectionViewer: CollectionViewer): Observable<readonly Reclamo[]> {
        return this.reclamosSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.reclamosSubject.complete();
        this.loadingSubject.complete();
        this.totalSubject.complete()
    }
}