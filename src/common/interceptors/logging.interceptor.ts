import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
  Logger,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, user } = req;
    const userId = user?.id;

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;

          this.logger.log(
            `${method} ${url} ${response.statusCode} ${delay}ms - User: ${userId || 'anonymous'}`,
          );
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            `${method} ${url} - ${delay}ms - User: ${userId || 'anonymous'}`,
            error.stack,
          );
        },
      }),
    );
  }
}
