import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../core/services/user.service';
 
interface Theme {
  id: string;
  hex: string;
  label: string;
}
 
@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-signup',
  styleUrl: './signup.scss',
  templateUrl: './signup.html',
  standalone: true,
})
export class Signup {
  // 5 preset chat-background themes - swap hex codes for your palette
  readonly THEMES: Theme[] = [
    { id: 'theme-1', hex: '#F6C6EA', label: 'Blossom' },
    { id: 'theme-2', hex: '#C6E2FF', label: 'Sky' },
    { id: 'theme-3', hex: '#C8F7C5', label: 'Mint' },
    { id: 'theme-4', hex: '#FFE3A3', label: 'Honey' },
    { id: 'theme-5', hex: '#D9C6FF', label: 'Lavender' },
  ];
 
  username = '';
  email = '';
  password = '';
  dob = '';
  selectedTheme = signal<string>(this.THEMES[0].id);
 
  // avatar upload state
  avatarUrl = signal<string | null>(null);
  avatarPreview = signal<string | null>(null);
  avatarUploading = signal(false);
  avatarError = signal<string | null>(null);
 
  submitting = signal(false);
  error_message = '';
 
  private readonly MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
  private uploadUrl = 'http://localhost:3000/api/uploads/image';
 
  // submit is disabled while an avatar upload is mid-flight or already submitting
  formBusy = computed(() => this.avatarUploading() || this.submitting());
 
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
  ) {}
 
  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
 
    this.avatarError.set(null);
 
    if (!file.type.startsWith('image/')) {
      this.avatarError.set('Please choose an image file');
      input.value = '';
      return;
    }
    if (file.size > this.MAX_AVATAR_BYTES) {
      this.avatarError.set('Image must be under 2MB');
      input.value = '';
      return;
    }
 
    // local preview while it uploads
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(reader.result as string);
    reader.readAsDataURL(file);
 
    this.avatarUploading.set(true);
    const formData = new FormData();
    formData.append('image', file);
 
    this.http.post<{ url: string }>(this.uploadUrl, formData).subscribe({
      next: (res) => {
        this.avatarUrl.set(res.url);
        this.avatarUploading.set(false);
      },
      error: (err) => {
        this.avatarError.set(err.error?.message || 'Upload failed, try again');
        this.avatarUploading.set(false);
        this.avatarPreview.set(null);
        input.value = '';
      },
    });
  }
 
  selectTheme(themeId: string) {
    this.selectedTheme.set(themeId);
  }
 
  //Creating a user through the signup fields
  onSubmit(form: NgForm) {
    if (form.invalid || this.formBusy()) {
      return; // submit button is disabled in this state too, this is belt-and-suspenders
    }
 
    this.error_message = '';
    this.submitting.set(true);
 
    this.userService.createUser({
      username: this.username,
      email: this.email,
      password: this.password,
      dob: this.dob,
      avatarUrl: this.avatarUrl() ?? undefined,
      theme: this.selectedTheme(),
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error_message = err.error?.message || 'An error has occurred';
        this.submitting.set(false);
      },
    });
  }
}
 