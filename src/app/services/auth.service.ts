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
  async currentUser() {
    const { data, error } = await this.supabaseClient.auth.getUser();

    if (error) {
      console.error('Error al obtener el usuario:', error.message);
      return null;
    }

    console.log('Usuario actual:', data.user);
    return data.user;
  }

  logIn(credential: SignInWithPasswordCredentials) {
    return this.supabaseClient.auth.signInWithPassword(credential);
  }
  signOut() {
    return this.supabaseClient.auth.signOut();
  }
}
