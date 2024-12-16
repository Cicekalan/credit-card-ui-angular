import { Component } from '@angular/core';
import { CreditCardComponent } from './credit-card/credit-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CreditCardComponent],
  template: '<app-credit-card></app-credit-card>',
  
})
export class AppComponent {
  
}
