import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateTimePickerOptions } from '../datetimepicker.types';

export interface DateTimeDialogData {
  value: Date | null;
  label: string;
  options: DateTimePickerOptions;
}

@Component({
  selector: 'app-datetimepicker-dialog',
  standalone: true,
  templateUrl: './datetimepicker-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class DateTimePickerDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DateTimePickerDialogComponent>);
  readonly data = inject<DateTimeDialogData>(MAT_DIALOG_DATA);

  private readonly width_hh_mm_inputs = signal('90px')


  private readonly initial = this.data.value ? new Date(this.data.value) : new Date();
  private readonly hourStep = Math.max(1, this.data.options.stepHour ?? 1);
  private readonly minuteStep = this.data.options.stepMinute ?? 1;

  readonly hours = computed(() =>
    Array.from({ length: Math.ceil(24 / this.hourStep) }, (_, i) => i * this.hourStep)
  );

  readonly minutes = computed(() =>
    Array.from({ length: 60 / this.minuteStep }, (_, i) => i * this.minuteStep)
  );

  readonly selectedDate = signal<Date>(
    new Date(this.initial.getFullYear(), this.initial.getMonth(), this.initial.getDate())
  );

  readonly selectedHour = signal<number>(
    Math.floor(this.initial.getHours() / this.hourStep) * this.hourStep
  );
  readonly selectedMinute = signal<number>(
    Math.floor(this.initial.getMinutes() / this.minuteStep) * this.minuteStep
  );

  readonly showDate = computed(() => this.data.options.pickerType !== 'timer');
  readonly showTime = computed(() => this.data.options.pickerType !== 'calendar');

  onDateSelect(date: Date | null): void {
    if (date) {
      this.selectedDate.set(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    }
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  clear(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const result = new Date(this.selectedDate());
    if (this.showTime()) {
      result.setHours(this.selectedHour(), this.selectedMinute(), 0, 0);
    } else {
      result.setHours(0, 0, 0, 0);
    }
    this.dialogRef.close(result);
  }
}
