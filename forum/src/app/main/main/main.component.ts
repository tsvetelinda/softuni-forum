import { Component } from '@angular/core';
import { ThemesListComponent } from '../../theme/themes-list/themes-list.component';
import { PostsListComponent } from '../../posts-list/posts-list.component';
import { WelcomeMessageComponent } from "../../shared/welcome-message/welcome-message.component";
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ThemesListComponent, PostsListComponent, WelcomeMessageComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private userService: UserService) {}

  get isLoggedIn() : boolean {
    return this.userService.isLogged;
  }
}
