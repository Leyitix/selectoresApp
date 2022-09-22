import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.com/v2';
  private _regiones: string[]= [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {

    const url: string = `${this.baseUrl}/region/${ region }?fields=alpha3Code&fields=name`;
    return this.http.get<PaisSmall[]>( url ); 

  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null> {

    // si no existe un código retornamos null
    if ( !codigo ) {
      return of(null)
    }
    
    const url: string = `${this.baseUrl}/alpha/${ codigo }`;
    return this.http.get<Pais>( url );

  }

  getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall> {
    
    const url: string = `${this.baseUrl}/alpha/${ codigo }?fields=name;fields=alpha3Code`;
    return this.http.get<PaisSmall>( url );

  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {

    // si no hay fronteras devuelve un arreglo vacío
    if ( !borders ) {
      return of([]);
    }

    // es un arreglo de peticiones de tipo PaisSmall
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo =>  {
      const peticion = this.getPaisPorCodigoSmall( codigo );
      peticiones.push( peticion );
    });

    // disparamos todas las peticiones de manera simultánea
    // devuelve  un arreglo con todas las peticiones
    return combineLatest( peticiones );

  }

}
