import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: []
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : [ '', Validators.required ],
    pais    : [ '', Validators.required ],
    frontera: [ '', Validators.required ]
  })

  // llenar selectores
  regiones : string[]    = [];
  paises   : PaisSmall[] = [];
  fronteras: PaisSmall[] = [];
  // fronteras: string[]      = [];

  // UI
  cargando: boolean = false;

  constructor( private fb: FormBuilder,
               private ps: PaisesService ) { }

  ngOnInit(): void {

    this.regiones = this.ps.regiones;

    // cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.ps.getPaisesPorRegion( region ) )
      )
      .subscribe( ( paises ) => {
        this.paises = paises;
        this.cargando = false;
      });

      // cuando cambie el pais
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( () => {
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap( codigo =>  this.ps.getPaisPorCodigo( codigo ) ),
          switchMap( pais => this.ps.getPaisesPorCodigos( pais?.borders! ) ) // si tiene país siempre va a tener borders
        )
        .subscribe( paises => { 
          this.fronteras = paises
          console.log( paises );
          
          this.cargando = false;
        })
        
  }

  guardar(){
    console.log( this.miFormulario.value );
  }

}
