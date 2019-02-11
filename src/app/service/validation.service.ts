import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Injectable()
export class ValidationService {
  isEmail(email: any) {
    if (email && typeof email === 'string') {
      const re = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]){0,}@[a-zA-Z0-9-]+\.([a-zA-Z]{1,6}\.)?[a-zA-Z]{2,6}$/;
      return re.test(String(email).toLowerCase());
    } else {
      return false;
    }
  }

  usernameExists(username): boolean {
    return false;
  }

  passwordStrength(password: any): string {
    /**
     *
     *  GOTTEN FROM : https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
     */
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    const medium = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    if (password && typeof password === 'string') {
      if (strong.test(password)) {
        return 'STRONG';
      }
      if (medium.test(password)) {
        return 'MEDIUM';
      }
    }
    return 'WEAK';
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isFieldInvalid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  isFieldValid(form: FormGroup, field: string) {
    return form.get(field).valid;
  }
}
