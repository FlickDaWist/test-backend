import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    const path = context.switchToHttp().getRequest();

    return next
      .handle()
      .pipe(
        tap(() => console.log(` Request , After... ${Date.now() - now}ms`)),
      );
  }
}
