import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

// import {AngularFireDatabase} from '@angular/fire/database';
import {auth} from 'firebase/app';
import {environment} from '../../../../environments/environment';

import {User} from './User';

const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({providedIn: 'root'})

export class AuthService {

    // authState: FirebaseAuthState = null;
    private userUrl = 'api/heroes';  // URL to web api
    private user;

    constructor(private http: HttpClient,
                private afAuth: AngularFireAuth) {

        this.afAuth.authState.subscribe((user) => {
            if (user) {
                this.user = user;
                localStorage.setItem('user', JSON.stringify(this.user));
            } else {
                localStorage.setItem('user', null);
            }
        });
    }


    // Save a user
    save(user: User): any {
        return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
    }

    async logout() {
        await this.afAuth.auth.signOut();
        localStorage.removeItem('user');
        // this.router.navigate(['admin/login']);
    }

    // logout() {
    //     this.afAuth.auth.signOut()
    //         .then((res) => {
    //             localStorage.removeItem('user');
    //             this.router.navigate(['/login']);
    //         });
    // }



    //
    // async login(email: string, password: string) {
    //     try {
    //         await  this.afAuth.auth.signInWithEmailAndPassword(email, password);
    //     } catch (e) {
    //         console.log("Error!" + e.message);
    //     }
    // }

    login(user: User) {
        return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
    }

    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return user !== null;
    }


    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result ?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            // this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
// private log(message: string) {
//     this.messageService.add(`HeroService: ${message}`);
// }
}