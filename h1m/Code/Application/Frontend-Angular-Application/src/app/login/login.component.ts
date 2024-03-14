import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router) {

  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;

      this.http.post('http://127.0.0.1:5000/login', data).subscribe(
        (response) => {
          console.log(response); // Process the response data
          alert('Login Successfully!')
          this.router.navigate(['/content']);
        },
        (error) => {
          console.error(error); // Handle any errors
          alert(error!.error!.message)
        }
      );
    }
  }

}
