import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const superAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getCurrentUser();

  //If user == super_admin, then allow access to the route, otherwise redirect to login page
  //Remembering the super_admin has it's own shell
  if (user?.role === 'super_admin') return true;
  router.navigate(['/login']);
  return false;
};