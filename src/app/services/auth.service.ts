import { inject, Injectable } from '@angular/core';
import {
  createClient,
  SignInWithPasswordCredentials,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
  }

  logIn(credential: SignInWithPasswordCredentials) {
    return this.supabaseClient.auth.signInWithPassword(credential);
  }
  singOut() {
    return this.supabaseClient.auth.signOut();
  }
}
