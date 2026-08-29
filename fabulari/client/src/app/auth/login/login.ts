import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; //For Error messages

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
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
          this.router.navigate(['/superadmin/requests']);
        } else {
          this.router.navigate(['/app/dashboard']);
        }
      },
      error: () => this.error_message = 'Invalid username or password'
    });
  }
}
