import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private url =  'https://heroeapp-f7dc5-default-rtdb.firebaseio.com';

  constructor( private http: HttpClient ) { }

  crearHeroe( heroe: HeroeModel ) {
    return this.http.post(`${ this.url }/Heroes.json`, heroe)
      .pipe(
        map( (resp: any) => {
          heroe.id = resp.name;
          return heroe;
        })
      );
  }

  actualizarHeroe( heroe: HeroeModel ) {
    // Creamos una copia del heroe para eliminar el id
    // y que no se muestre en Firebase pero que sigamos teniendo el id en el form
    const heroeTemp = {
      ...heroe
    };
    delete heroeTemp.id;
    return this.http.put(`${ this.url }/Heroes/${ heroe.id }.json`, heroeTemp);
  }

  borrarHeroe( id:string ) {
    return this.http.delete(`${this.url}/Heroes/${ id }.json`);
  }
 
  getHeroes() {
    return this.http.get(`${ this.url }/Heroes.json`)
      .pipe(
        map( this.crearArreglo ),
        delay(1500)
      );
  }

  getHeroe( id: string ) {
    return this.http.get(`${ this.url }/Heroes/${ id }.json`);
  }

  private crearArreglo( heroeObj: object ) {
    const heroes: HeroeModel[] = [];
    if (heroeObj === null) { return []; }

    Object.keys( heroeObj ).forEach( key => {
      const heroe: HeroeModel = heroeObj[key];
      heroe.id = key;
      heroes.push( heroe );
    });
    
    return heroes;
  }
}
