import { MatFormFieldAppearance, SubscriptSizing } from '@angular/material/form-field';

/**
 * Defines which selection views are enabled in the picker UI.
 *
 * - `'both'`: Displays both the date calendar and the time selector.
 * - `'calendar'`: Displays only the date calendar.
 * - `'timer'`: Displays only the time selector.
 */
export type PickerModeType = 'both' | 'calendar' | 'timer';

/**
 * Supported date display and parsing patterns.
 *
 * - `'dd/MM/yyyy'`: European / UK format (e.g., `17/11/2026`).
 * - `'MM/dd/yyyy'`: US format (e.g., `11/17/2026`).
 * - `'yyyy-MM-dd'`: ISO 8601 format (e.g., `2026-11-17`).
 */
export type SupportedDateFormat = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';

/**
 * Allowed step increments (in minutes) for the minute dropdown selector.
 */
export type MinuteInterval = 1 | 5 | 10 | 15 | 20 | 30;

/**
 * Configuration options for customizing the behavior, formatting,
 * validation boundaries, and layout of the DateTimePicker component.
 */
export interface DateTimePickerOptions {
  /**
   * Determines whether the user can select a date, a time, or both.
   */
  pickerType: PickerModeType;

  /**
   * Format pattern used to display and parse the date portion.
   * Not required when `pickerType` is set to `'timer'`.
   *
   * @default 'dd/MM/yyyy'
   */
  dateFormat?: SupportedDateFormat;

  /**
   * Controls the clock format for the time selector.
   *
   * - `true`: 24-hour clock (`00:00` – `23:59`).
   * - `false`: 12-hour clock (`12:00 AM` – `11:59 PM`).
   *
   * @default true
   */
  hour24?: boolean;

  /**
   * Earliest selectable date and time.
   * Dates/times prior to this value will be disabled in the UI.
   */
  minDate?: Date | null;

  /**
   * Latest selectable date and time.
   * Dates/times after this value will be disabled in the UI.
   */
  maxDate?: Date | null;

  /**
   * Increment interval for the hour selector options.
   *
   * @default 1
   */
  stepHour?: number;

  /**
   * Increment interval for the minute selector options.
   *
   * @default 1
   */
  stepMinute?: MinuteInterval;

  /**
   * Visual style variant of the `<mat-form-field>` container.
   *
   * - `'fill'`: Solid background shading with a bottom underline indicator.
   * - `'outline'`: Transparent background surrounded by a full border stroke.
   *
   * @default 'fill'
   */
  appearance?: MatFormFieldAppearance;

  /**
   * Controls how vertical space is reserved below the `<mat-form-field>`
   * for `<mat-hint>` and `<mat-error>` messages.
   *
   * - `'fixed'`: Always reserves space to prevent surrounding elements from shifting.
   * - `'dynamic'`: Collapses bottom space when empty and expands only when a message is shown.
   *
   * @default 'dynamic'
   */
  subscriptSizing?: SubscriptSizing;

  /**
   * Space-separated CSS utility classes applied to the host `<mat-form-field>`
   * (e.g., `'w-100'`).
   */
  classes?: string;

  /**
   * Explicit CSS width value for the form field (e.g., `'200px'`, `'14rem'`).
   * Overrides width utility classes (such as `'w-100'`) by constraining `max-width`.
   */
  width?: string;
}
