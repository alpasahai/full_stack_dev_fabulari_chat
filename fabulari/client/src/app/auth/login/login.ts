import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class Login {
  username = '';
  password = '';
  error_message = '';

  constructor(private auth: AuthService, private router: Router) {}

  //Event Handler for the login form submission
  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (user) => {
        this.auth.saveSession(user);
        if (user.role === 'super_admin') {
          this.router.navigate(['/superadmin/users']);
        } else {
          this.router.navigate(['/app/dashboard']);
        }
      },
      error: () => this.error_message = 'Invalid username or password'
    });
  }
}
