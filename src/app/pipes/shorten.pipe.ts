import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  transform(value?: string, limit: number = 10): string {
    if (value && value.length > limit) {
      return value.substring(0, limit) + '...'
    }
    return '';
  }

}
