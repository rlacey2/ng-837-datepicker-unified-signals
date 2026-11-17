# Unified Signal DateTimePicker (Angular 22 + Angular Material)

A reusable, lightweight, **100% pure-Angular Signals** date and time picker component built exclusively with official `@angular/material` primitives (`MatCalendar`, `MatDialog`, `MatSelect`, `MatFormField`).

It presents **one single `<input>` control** and opens **one unified dialog** supporting combined Date & Time, Date-only, or Time-only modes—with **zero third-party date/time libraries**, **zero RxJS form boilerplate**, and **font-neutral inline SVG icons**.

---

## Features

- **100% Angular Signals Architecture**
  - Implements `FormValueControl<Date | null>` from `@angular/forms/signals` (`form()`, `[formField]`, `model()`).
  - Uses `input.required()`, `output()`, `computed()`, and `ChangeDetectionStrategy.OnPush`.
  - Uses modern built-in control flow (`@if`, `@for`, `@switch`).
- **Zoneless Ready**: Configured with `provideZonelessChangeDetection()` (no `zone.js` required).
- **Single Input & Unified Dialog**: Displays one formatted input field (`dd/MM/yyyy HH:mm`) that opens a single Material 3 dialog combining `<mat-calendar>` and Hour/Minute dropdowns.
- **Configurable Formats & Intervals**:
  - Defaults to European **`dd/MM/yyyy`** with Monday-first calendar weeks (`MAT_DATE_LOCALE = 'en-IE'`).
  - Supports `'dd/MM/yyyy'`, `'MM/dd/yyyy'`, and `'yyyy-MM-dd'`.
  - Supports **24-hour** (`hour24: true`) and **12-hour AM/PM** (`hour24: false`) display.
  - Configurable minute intervals (`1 | 5 | 10 | 15 | 20 | 30`), defaulting to **`1`** (`00` through `59`).
- **Font-Neutral Inline SVG Icons**: No external Google Fonts or `Material Icons` stylesheet dependencies—works cleanly offline and behind strict Content Security Policies (CSP).
- **Clean Separation of Concerns**: Every component (`app`, `datetimepicker`, `datetimepicker-dialog`) has dedicated `.ts` and `.html` files.

---

## Project Structure

```text
src/
├── index.html                                  # Clean UTF-8 entry point (no external font links)
├── main.ts                                     # Standalone application bootstrap
├── styles.css                                  # Material 3 theme (azure-blue) + system font stack
└── app/
    ├── app.config.ts                           # Zoneless provider, NativeDateAdapter, en-IE locale
    ├── app.ts                                  # Signal Form demo with 5 picker configurations
    ├── app.html                                # Centered Bootstrap card layout & live JSON output
    └── datetimepicker/
        ├── datetimepicker.types.ts             # DateTimePickerOptions & strict union types
        ├── date-format.util.ts                 # Pure TypeScript date/time display formatter
        ├── datetimepicker.ts                   # Reusable FormValueControl<Date | null> component
        ├── datetimepicker.html                 # Single mat-form-field + inline SVG icons
        ├── datetimepicker-dialog.ts            # Unified MatDialog logic (calendar + time signals)
        └── datetimepicker-dialog.html          # Unified MatDialog template
```

---

## Prerequisites & Setup

- **Node.js**: `v20.19+` or `v22+`
- **Angular CLI**: `v22+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```
Open `http://localhost:4200` in your browser.

---

## Configuration API (`DateTimePickerOptions`)

Pass a `DateTimePickerOptions` object into the required `[options]` signal input:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`pickerType`** *(required)* | `'both' \| 'calendar' \| 'timer'` | `'both'` | Renders Date + Time, Date only, or Time only. |
| **`dateFormat`** | `'dd/MM/yyyy' \| 'MM/dd/yyyy' \| 'yyyy-MM-dd'` | `'dd/MM/yyyy'` | Controls how the date portion is formatted in the input box. |
| **`hour24`** | `boolean` | `true` | `true` for 24-hour clock (`14:30`), `false` for 12-hour AM/PM (`02:30 PM`). |
| **`stepMinute`** | `1 \| 5 \| 10 \| 15 \| 20 \| 30` | `1` | Minute dropdown step interval (`1` renders all `00..59` minutes). |
| **`stepHour`** | `number` | `1` | Hour dropdown step interval (`1` renders `00..23`). |
| **`minDate`** | `Date \| null` | `null` | Minimum selectable date in `<mat-calendar>`. |
| **`maxDate`** | `Date \| null` | `null` | Maximum selectable date in `<mat-calendar>`. |
| **`classes`** | `string` | `'w-100'` | CSS classes applied to the host `<mat-form-field>`. |

---

## Component Inputs & Outputs

| Binding | Kind | Type | Description |
| :--- | :--- | :--- | :--- |
| **`[formField]`** | Directive (`FormField`) | `FieldTree<Date \| null>` | Binds the component directly to an Angular Signal Form field. |
| **`[label]`** | `input.required` | `string` | Floating `<mat-label>` and dialog header title. |
| **`[options]`** | `input.required` | `DateTimePickerOptions` | Configuration object controlling mode, format, bounds, and steps. |
| **`(dateTimeChange)`** | `output` | `Date \| null` | Emits whenever the user clicks **Set** or **Clear** in the dialog. |

---

## Usage Example (With Angular Signal Forms)

### `example.ts`
```typescript
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { DateTimePickerComponent } from './datetimepicker/datetimepicker';
import { DateTimePickerOptions } from './datetimepicker/datetimepicker.types';

export interface EventModel {
  startDateTime: Date | null;
  deadlineDate: Date | null;
  reminderTime: Date | null;
}

@Component({
  selector: 'app-event-form',
  standalone: true,
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, DateTimePickerComponent],
})
export class EventFormComponent {
  // 1. Writable signal model
  readonly model = signal<EventModel>({
    startDateTime: new Date(),
    deadlineDate: null,
    reminderTime: null,
  });

  // 2. Signal Form with schema validation
  readonly eventForm = form(this.model, (schema) => {
    required(schema.startDateTime, { message: 'Start date & time is required' });
  });

  // 3. Field definitions
  readonly fields = computed(() => [
    {
      name: 'startDateTime' as const,
      field: this.eventForm.startDateTime,
      label: 'Start Date & Time',
      options: {
        pickerType: 'both',
        dateFormat: 'dd/MM/yyyy',
        hour24: true,
        stepMinute: 1,
      } satisfies DateTimePickerOptions,
    },
    {
      name: 'deadlineDate' as const,
      field: this.eventForm.deadlineDate,
      label: 'Deadline (Date Only)',
      options: {
        pickerType: 'calendar',
        dateFormat: 'dd/MM/yyyy',
      } satisfies DateTimePickerOptions,
    },
    {
      name: 'reminderTime' as const,
      field: this.eventForm.reminderTime,
      label: 'Reminder (15-min intervals)',
      options: {
        pickerType: 'timer',
        stepMinute: 15,
      } satisfies DateTimePickerOptions,
    },
  ]);

  onDateChanged(field: keyof EventModel, value: Date | null): void {
    console.log('Updated:', field, value);
  }
}
```

### `example.html`
```html
<form novalidate class="row g-3">
  @for (item of fields(); track item.name) {
    <div class="col-12 col-md-4">
      <app-datetimepicker
        [formField]="item.field"
        [label]="item.label"
        [options]="item.options"
        (dateTimeChange)="onDateChanged(item.name, \$event)"
      />
    </div>
  }
</form>
```

---

## Standalone Usage (Without Signal Forms)

Because `value` is a `model<Date | null>(null)` signal, you can also bind directly using two-way signal binding `[(value)]` outside of a form:

```html
<app-datetimepicker
  [(value)]="selectedDate"
  label="Standalone Date & Time"
  [options]="{ pickerType: 'both', dateFormat: 'dd/MM/yyyy' }"
/>
```

---

## Troubleshooting

- **Missing calendar adapter error (`MatDatepicker: No provider found for DateAdapter`)**: Ensure `provideNativeDateAdapter()` is registered in `app.config.ts` (and/or inside `DateTimePickerDialogComponent` `providers`).
- **`parse5` `misplaced-doctype` on `index.html`**: Ensure `src/index.html` is saved as **UTF-8 without BOM** with `<!doctype html>` on line 1, column 1.
- **Zoneless build error (`Failed to resolve dependency: zone.js`)**: Verify `"polyfills": []` in `angular.json` when using `provideZonelessChangeDetection()`.
