import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  template: `
    <label class="flex flex-col gap-1">
      <span class="text-sm font-medium">{{ label() }}</span>
      <ng-content />
      @if (error()) {
        <span class="text-sm text-danger" role="alert">{{ error() }}</span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  error = input<string | null>(null);
  label = input.required<string>();
}
