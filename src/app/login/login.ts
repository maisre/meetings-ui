import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ch-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);

  credentials = {
    username: '',
    password: '',
  };

  public onSubmit() {
    if (this.credentials.username && this.credentials.password) {
      this.authService.login(this.credentials.username, this.credentials.password);
    }
  }

  public logout() {
    this.authService.logout();
  }
}
