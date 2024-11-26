import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-message',
  standalone: true,
  imports: [],
  templateUrl: './welcome-message.component.html',
  styleUrl: './welcome-message.component.css'
})
export class WelcomeMessageComponent {
  @Input('isLoggedIn') isLoggedIn = false;
}
