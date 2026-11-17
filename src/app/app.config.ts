import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-IE' },
    provideNativeDateAdapter(),

  {
/*
If you want 'dynamic' (or 'fixed') to be the default across your entire application without 
repeating the attribute on every <mat-form-field>
*/

      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'fixed',  // dynamic | fixed
        appearance: 'outline',       // outline | fill
      },
    },

    
  ],
};
