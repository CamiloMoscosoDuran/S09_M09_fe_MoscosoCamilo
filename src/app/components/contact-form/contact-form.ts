import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: false,
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css'
})
export class ContactFormComponent {
  @ViewChild('contactForm') form!: NgForm;

  formData = {
    name: '',
    email: '',
    message: ''
  };

  submitted = false;
  submitSuccess = false;
  submitError = false;

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.submitted = true;
      this.submitSuccess = true;
      this.submitError = false;
      console.log('Formulario enviado:', this.formData);
      
      setTimeout(() => {
        this.submitted = false;
        this.submitSuccess = false;
        this.resetForm();
      }, 3000);
    } else {
      this.submitError = true;
      console.log('Formulario inválido');
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
    if (this.form) {
      this.form.resetForm();
    }
  }
}
