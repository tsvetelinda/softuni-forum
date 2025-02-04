import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/email.validator';
import { DOMAINS } from '../../constants';
import { ProfileDetails } from '../../types/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  showEditMode: boolean = false;

  profileDetails: ProfileDetails = {
    username: '',
    email: '',
    tel: ''
  }

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, emailValidator(DOMAINS)]),
    tel: new FormControl('')
  })

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getProfile().subscribe((user) => {
      if (user) {  
        this.profileDetails = {
          username: user.username,
          email: user.email,
          tel: user.tel ?? ''
        };
  
        this.form.setValue({
          username: user.username, 
          email: user.email,
          tel: user.tel ?? ''
        });
      }
    });
  }
  
  toggleEditMode() {
    this.showEditMode = !this.showEditMode;
  }

  handleSaveProfile() {
    if (this.form.invalid) {
      return;
    }
    this.profileDetails = this.form.value as ProfileDetails;
    const {username, email, tel} = this.profileDetails;

    this.userService.updateProfile(username, email, tel).subscribe(() => {
      this.toggleEditMode();
    });
  }

  handleCancel(event: Event) {
    event.preventDefault();
    this.toggleEditMode();
  }
}
