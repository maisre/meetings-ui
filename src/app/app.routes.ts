import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Meetings } from './meetings/meetings';
import { Members } from './members/members';
import { Search } from './search/search';
import { ConductMeeting } from './conduct-meeting/conduct-meeting';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'meetings', component: Meetings },
  { path: 'members', component: Members },
  { path: 'search', component: Search },
  { path: 'conduct/:id', component: ConductMeeting },
];
