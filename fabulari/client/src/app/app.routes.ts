import { Routes } from '@angular/router';

// Importing components and guards
import { Login } from './auth/login/login';
import { Dashboard } from './user-shell/dashboard/dashboard';
import { ManageUsers } from './super-admin-shell/manage-users/manage-users';
import { authGuard } from './core/guards/auth-guard';
import { superAdminGuard } from './core/guards/super-admin-guard';

export const routes: Routes = [
  { path: 'login', component: Login },

  //User and group admin have the same shell, so they use the same route
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
    ]
  },

  //So the super admin is completely seperate, so it has it's own "shell"
  {
    path: 'superadmin',
    canActivate: [authGuard, superAdminGuard],
    children: [
      { path: 'users', component: ManageUsers },
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];