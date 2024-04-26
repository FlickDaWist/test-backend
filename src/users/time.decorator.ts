import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { LoggingInterceptor } from './log.interceptor';

export function ResponseTime() {
  return applyDecorators(
    UseInterceptors(LoggingInterceptor),
  );
}
