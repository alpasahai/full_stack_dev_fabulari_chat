import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-signup',
  styleUrl: './signup.scss',
  templateUrl: './signup.html',
  standalone: true,
})
export class Signup {
  username = '';
  email = '';
  password = '';
  dob = '';
  error_message = '';

  constructor(private userService: UserService, private router: Router) {}

  //Creating a user through the signup fields
  onSubmit(form: NgForm) {
    //Error checking:
    if(form.invalid) {
      alert("Please fill in the required fields...");
      return;
    }

    this.userService.createUser({
      username: this.username,
      email: this.email,
      password: this.password,
      dob: this.dob,
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error_message = err.error?.message || 'Error has occured'
    });

  }


}
