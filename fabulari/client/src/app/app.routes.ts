import { Routes } from '@angular/router';

// Importing components and guards
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Dashboard } from './user-shell/dashboard/dashboard';
import { Profile } from './user-shell/profile/profile';
import { GroupPage } from './user-shell/group-page/group-page';
//import { ManageUsers } from './super-admin-shell/manage-users/manage-users';
import { authGuard } from './core/guards/auth-guard';
import { superAdminGuard } from './core/guards/super-admin-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  //User and group admin have the same shell, so they use the same route
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'profile', component: Profile },   
      { path: 'group/:id', component: GroupPage },
    ]
  },

  //So the super admin is completely seperate, so it has it's own "shell"
  {
    path: 'superadmin',
    canActivate: [authGuard, superAdminGuard],
    children: [
      //{ path: 'requests', component: ManageUsers }, //ManageUsers is where the requsts page is for the superadmin
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];