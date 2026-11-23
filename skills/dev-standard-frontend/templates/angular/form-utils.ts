import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    const errors = form.controls[fieldName]?.errors;

    return errors ? FormUtils.getTextError(errors) : null;
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    const errors = formArray.controls[index]?.errors;

    return errors ? FormUtils.getTextError(errors) : null;
  }

  static isFieldEqualTo(field: string, otherField: string) {
    return (group: AbstractControl): ValidationErrors | null =>
      group.get(field)?.value === group.get(otherField)?.value ? null : { fieldsNotEqual: true };
  }

  static isValidField(form: FormGroup, fieldName: string): boolean {
    const control = form.controls[fieldName];

    return !!control?.errors && control.touched;
  }

  static isValidFieldInArray(formArray: FormArray, index: number): boolean {
    const control = formArray.controls[index];

    return !!control?.errors && control.touched;
  }

  private static getTextError(errors: ValidationErrors): string | null {
    const [key] = Object.keys(errors);

    switch (key) {
      case 'email':
        return 'El correo no es válido';
      case 'fieldsNotEqual':
        return 'Los campos no coinciden';
      case 'min':
        return `Valor mínimo de ${errors['min'].min}`;
      case 'minlength':
        return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      case 'pattern':
        return errors['pattern'].requiredPattern === FormUtils.emailPattern
          ? 'El valor no parece un correo'
          : 'El formato no es válido';
      case 'required':
        return 'Este campo es requerido';
      default:
        return key ? 'Valor no válido' : null;
    }
  }
}
