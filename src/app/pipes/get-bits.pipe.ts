import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getBits'
})
export class GetBitsPipe implements PipeTransform {

  transform(value: string, arg: number): string {
    return value.charAt(arg);
  }

}
