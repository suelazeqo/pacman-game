import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFirestore) {

  }

  // Get the users stored in firebase.
  getAllUsers() {
    return new Promise<any>((resolve)=> {
      this.db.collection('Users').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }

  // Save new users that finished the game
  addNewUser(_newId:string, username:string, score:number) {
    this.db.collection("Users").doc(_newId).set({username:username,score:score});
  }
}
