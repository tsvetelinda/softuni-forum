import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-message',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome-message.component.html',
  styleUrl: './welcome-message.component.css'
})
export class WelcomeMessageComponent {
  @Input('isLoggedIn') isLoggedIn = false;
}
