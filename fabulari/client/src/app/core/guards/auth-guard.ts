import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  //This is basically if the user is logged in, then allow access to the route, otherwise redirect to login page
  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};