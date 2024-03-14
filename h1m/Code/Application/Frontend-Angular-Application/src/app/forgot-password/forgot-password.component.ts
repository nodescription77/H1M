import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  showNewPasswordFields = false;
  notRegisteredError = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    // if (this.forgotPasswordForm.valid) {
      
    // }
    const data = this.forgotPasswordForm.value;

    this.http.post('http://127.0.0.1:5000/email-check', data).subscribe(
      (response) => {
        console.log(response); // Process the response data
        this.showNewPasswordFields = true;
      },
      (error) => {
        console.error(error); // Handle any errors
        this.notRegisteredError = true;
        this.errorMessage = error!.error!.message
      }
    );
  }

  onResetPassword() {
    const data = this.forgotPasswordForm.value;
    console.log(data)
    this.http.post('http://127.0.0.1:5000/forgot-password', data).subscribe(
      (response) => {
        console.log(response);
        alert('Password Reset Successfully!')
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error); // Handle any errors
      }
    );
  }
}
