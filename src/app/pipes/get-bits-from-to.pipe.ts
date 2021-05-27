import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getBitsFromTo'
})
export class GetBitsFromToPipe implements PipeTransform {

  transform(value: string, args: number[]): string {
    return value.substring(args[0], args[1]);
  }

}
