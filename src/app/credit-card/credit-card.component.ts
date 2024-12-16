import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.scss'
})
export class CreditCardComponent {
  title = 'CreditCardDemo';
  cardNumber = "";
  cardHolder = "";
  cardBank = "BANK";
  expiryDate = "";
  showDatePicker: boolean = false;
  isFlipped = false; // To handle card flip for CVV
  submitted = false;
  valid = false;
  invalid = false;
  currentYear: number;
  maxYear: number;
  months = [
    { value: '01', name: 'Jan' },
    { value: '02', name: 'Feb' },
    { value: '03', name: 'Mar' },
    { value: '04', name: 'Apr' },
    { value: '05', name: 'May' },
    { value: '06', name: 'Jun' },
    { value: '07', name: 'Jul' },
    { value: '08', name: 'Aug' },
    { value: '09', name: 'Sep' },
    { value: '10', name: 'Oct' },
    { value: '11', name: 'Nov' },
    { value: '12', name: 'Dec' },
  ];
  selectedMonth: string = '';
  cvv = '';

  constructor() {
    const today = new Date();
    const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));

    this.currentYear = new Date().getFullYear();
    this.maxYear = this.currentYear + 20;


    const month = String(nextYear.getMonth() + 1).padStart(2, '0');
    const year = String(nextYear.getFullYear()).slice(-2);  // Set maximum year for expiry date

    this.expiryDate = `${month}/${year}`; // Set default expiry date
  }

  // Format and validate card number
  updateCardNumber(inputValue: Event): void {
    const target = inputValue.target as HTMLInputElement;
    let value = target.value;

    const cleanedInput = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    const formattedNumber = cleanedInput.replace(/(.{4})/g, '$1 ').trim(); // Format card number

    this.cardNumber = formattedNumber;

    const cursorPosition = target.selectionStart || 0;
    const spacesBefore = (value.slice(0, cursorPosition).match(/ /g) || []).length;
    const newSpacesBefore = (formattedNumber.slice(0, cursorPosition).match(/ /g) || []).length;

    target.value = formattedNumber;
    target.selectionStart = target.selectionEnd = cursorPosition + (newSpacesBefore - spacesBefore);

    this.cardBank = this.detectCardType(cleanedInput);  // Detect card type
  }

  // Detect the type of card
  detectCardType(cardNumber: string): string {
    if (!cardNumber) return "BANK";

    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = parseInt(cardNumber.slice(0, 2), 10);
    const firstThreeDigits = parseInt(cardNumber.slice(0, 3), 10);

    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5" && firstTwoDigits >= 51 && firstTwoDigits <= 55) return "MasterCard";
    if (firstDigit === "3" && (firstTwoDigits === 34 || firstTwoDigits === 37)) return "American Express";
    if (firstThreeDigits === 979) return "Troy";

    return "BANK";
  }

  moveCursorToStart(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      inputElement.setSelectionRange(0, 0);
    }
  }

// Format expiry date to MM/YY and restrict to numbers
formatExpiryDate(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/[^0-9]/g, ''); // Only allow numeric characters
  
  if (value.length > 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4); // Format as MM/YY
  }
  
  // Parse the date
  if (value.length === 5) {
    const [month, year] = value.split('/');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const enteredMonth = parseInt(month, 10);
    const enteredYear = parseInt(`20${year}`, 10); // Convert YY to YYYY

    // Validate the date
    if (
      enteredMonth < 1 ||
      enteredMonth > 12 || // Month must be between 1 and 12
      enteredYear < currentYear || // Year must not be less than the current year
      (enteredYear === currentYear && enteredMonth < currentMonth) // If the year is the same, month must not be earlier than the current month
    ) {
      value = ''; // Clear input for invalid date
      alert('Invalid date: Past dates are not allowed.');
    }
  }

  input.value = value;
  this.expiryDate = value;
}

  // Check if a month is disabled
  isMonthDisabled(month: string): boolean {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; 
    return (
      this.currentYear === today.getFullYear() && parseInt(month) < currentMonth
    );
  }

  // Change the expiry year
  changeYear(direction: number): void {
    const newYear = this.currentYear + direction;
    if (newYear >= new Date().getFullYear() && newYear <= this.maxYear) {
      this.currentYear = newYear;
    }
  }

  // Select a specific month
  selectMonth(month: string): void {
    this.selectedMonth = month;
    this.expiryDate = `${month}/${this.currentYear.toString().slice(-2)}`;
    console.log(this.expiryDate);
    this.closeDatePicker();
  }

  // Close the date picker
  closeDatePicker(): void {
    this.showDatePicker = false;
  }

  convertToUppercase() {
    this.cardHolder = this.cardHolder.toLocaleUpperCase('tr');
  }

  // Allow only numeric inputs
  allowOnlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanedInput = input.value.replace(/[^0-9\s]/g, ''); // Remove non-numeric characters
    input.value = cleanedInput;
    this.cvv = cleanedInput;
  }

  // Allow only alphabetic inputs
  allowOnlyAlphabets(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s]/g, '');  // Remove non-alphabetic characters
    this.cardHolder = input.value;
  }

  // Flip card when focusing on CVV
  onCvvFocus(): void {
    this.isFlipped = true;
  }

  // Flip card back when leaving CVV input
  onCvvBlur(): void {
    this.isFlipped = false;
  }

  // Card number validation
  cardNumberValid(): boolean {
    const regex = /^\d{16,19}$/; // 16-19 rakam kontrolü
    return regex.test(this.cardNumber);
  }

  // Form submit handler
  onSubmit(): void {
    this.submitted = true; // Form gönderildi
    if (this.cardNumberValid()) {
      alert('Form submitted successfully!');
    } else {
      alert('Please correct the errors.');
    }
  }

}
