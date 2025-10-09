import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Meetings } from './meetings/meetings';
import { Members } from './members/members';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'meetings', component: Meetings },
  { path: 'members', component: Members },
];
