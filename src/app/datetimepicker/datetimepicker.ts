import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  model,
  computed,
  inject,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DateTimePickerOptions } from './datetimepicker.types';
import { DateTimePickerDialogComponent } from './dialog-popup/datetimepicker-dialog';
import { formatDateTimeValue } from './date-format.util';

@Component({
  selector: 'app-datetimepicker',
  standalone: true,
  templateUrl: './datetimepicker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class DateTimePickerComponent implements FormValueControl<Date | null> {
  private readonly dialog = inject(MatDialog);

  // The date/time value supplied by the parent form.
  readonly value = model<Date | null>(null);
  readonly disabled = input<boolean>(false);
  readonly touch = output<void>();

  readonly label = input.required<string>();
  readonly options = input.required<DateTimePickerOptions>();
  readonly dateTimeChange = output<Date | null>();

  readonly config = computed(() => ({
    pickerType: this.options().pickerType ?? 'both',
    dateFormat: this.options().dateFormat ?? 'dd/MM/yyyy',
    hour24: this.options().hour24 ?? true,
    minDate: this.options().minDate ?? null,
    maxDate: this.options().maxDate ?? null,
    stepHour: this.options().stepHour ?? 1,
    stepMinute: this.options().stepMinute ?? 1,
    classes: this.options().classes ?? 'w-100',
     width: this.options().width ?? 'null',
 subscriptSizing: this.options().subscriptSizing ?? 'dynamic',
 appearance: this.options().appearance ?? 'fill',
     
  }));

  readonly displayValue = computed(() =>
    formatDateTimeValue(
      this.value(),
      this.config().pickerType,
      this.config().dateFormat,
      this.config().hour24
    )
  );

  openPicker(): void {
    if (this.disabled()) return;

    const ref = this.dialog.open(DateTimePickerDialogComponent, {
      data: {
        value: this.value(),
        label: this.label(),
        options: this.config(),
      },
    });

    ref.afterClosed().subscribe((result: Date | null | undefined) => {
      this.touch.emit();
      if (result !== undefined) {
        this.value.set(result);
        this.dateTimeChange.emit(result);
      }
    });
  }
}
