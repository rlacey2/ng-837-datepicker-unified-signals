import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, validate } from '@angular/forms/signals';
import { DateTimePickerComponent } from './datetimepicker/datetimepicker';
import { DateTimePickerOptions } from './datetimepicker/datetimepicker.types';

export interface DemoFormModel {
  europeanDateTime: Date | null;
  europeanDateOnly: Date | null;
  isoDateOnly: Date | null;
  usDateTime12h: Date | null;
  timeOnly24h: Date | null;
     startDateTime: Date | null;
    finishDateTime: Date | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, FormField, DateTimePickerComponent],
})
export class App {
  readonly formModel = signal<DemoFormModel>({
    europeanDateTime: new Date(),
    europeanDateOnly: null,
    isoDateOnly: null,
    usDateTime12h: null,
    timeOnly24h: null,
    startDateTime: null,
    finishDateTime: null
  });

readonly demoForm = form(this.formModel, schema => {

  // Finish must not be earlier than start.
  validate(
    schema.finishDateTime,
    ({ value, valueOf }) => {

      const finish = value();
      const start = valueOf(schema.startDateTime);

      if (!finish || !start) {
        return null;
      }

      if (finish.getTime() < start.getTime()) {
        return {
          kind: 'invalidDateRange',
          message: 'Finish date/time cannot be earlier than start date/time.'
        };
      }

      return null;
    }
  );

});
  
  readonly lastEvent = signal<{ field: string; value: Date | null } | null>(null);

  readonly fields = computed(() => [
    {
      name: 'europeanDateTime' as const,
      field: this.demoForm.europeanDateTime,
      label: 'European Date & Time',
      options: {
        pickerType: 'both',
        dateFormat: 'dd/MM/yyyy',
        hour24: true,
        stepMinute: 1,
        classes: 'w-100',
        width: '200px',
        appearance: 'outline',
        subscriptSizing: 'dynamic',
      } satisfies DateTimePickerOptions,
    },
    {
      name: 'europeanDateOnly' as const,
      field: this.demoForm.europeanDateOnly,
      label: 'European Date',
      options: {
        pickerType: 'calendar',
        dateFormat: 'dd/MM/yyyy',
        classes: 'w-100',
        width: '160px'
      } satisfies DateTimePickerOptions,
    },
    { 
      name: 'isoDateOnly' as const,
      field: this.demoForm.isoDateOnly,
      label: 'ISO Date Only (yyyy-MM-dd)',
      options: {
        pickerType: 'calendar',
        dateFormat: 'yyyy-MM-dd',
        classes: 'w-100',
        width: '260px'
      } satisfies DateTimePickerOptions,
    },
    {
      name: 'usDateTime12h' as const,
      field: this.demoForm.usDateTime12h,
      label: 'US Date & 12h Time (MM/dd/yyyy)',
      options: {
        pickerType: 'both',
        dateFormat: 'MM/dd/yyyy',
        hour24: false,
        stepMinute: 15,

        classes: 'w-100',
     //   width: '200px'
      } satisfies DateTimePickerOptions,
    },
    {
      name: 'timeOnly24h' as const,
      field: this.demoForm.timeOnly24h,
      label: 'Time Only (24h)',
      options: {
        pickerType: 'timer',
        hour24: true,
        stepMinute: 5,
        classes: 'w-100',
        width: '170px'
      } satisfies DateTimePickerOptions,
    },
  ]);




  // need schema cross validation between the fields
  // The start date cannot exceed the finish date.
  readonly startOptions:any = computed(() => ({
    dateFormat: 'dd/MM/yyyy',
    pickerType: 'both',
    
    hour24: true,
    stepMinute: 15,
    maxDate: this.demoForm.finishDateTime().value()
  }));
 

  // The finish date cannot precede the start date.
  readonly finishOptions:any = computed(() => ({
    dateFormat: 'dd/MM/yyyy',
    pickerType: 'both',
    hour24: true,
    stepMinute: 15,
    minDate: this.demoForm.startDateTime().value()
  }));




  onPickerChange(field: keyof DemoFormModel, value: Date | null): void {
    this.lastEvent.set({ field, value });
  }

 


}
