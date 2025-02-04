import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { emailValidator } from '../../utils/email.validator';
import { DOMAINS } from '../../constants';
import { matchPasswordsValidator } from '../../utils/match-passwords.validator';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, emailValidator(DOMAINS)]),
    telephone: new FormControl(''),
    passGroup: new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      rePassword: new FormControl('', [Validators.required])
    }, 
  {
    validators: [matchPasswordsValidator('password', 'rePassword')]
  })
  });

  constructor(private userService: UserService, private router: Router) { }

  isFieldEmpty(controlName: string) {
    return this.form.get(controlName)?.touched && this.form.get(controlName)?.errors?.['required'];
  } 

  get usernameMinLengthError() : boolean {
    return this.form.get('username')?.touched && this.form.get('username')?.errors?.['minlength'];
  }

  get passGroup() {
    return this.form.get('passGroup');
  }

  get isEmailValid() : boolean {
    return this.form.get('email')?.touched && this.form.get('email')?.errors?.['emailValidator'];
  }

  register() {
    if (this.form.invalid) {
      return;
    }
    const { username, email, telephone, passGroup: {password, rePassword} = {} } = this.form.value;

    this.userService.register(username!, email!, telephone!, password!, rePassword!)
    .subscribe(() => {
      this.router.navigate(['/themes']);
    });
  }
}
