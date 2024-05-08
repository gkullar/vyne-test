import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@env/environment';

export const basicAuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const isApiRoute = req.url.startsWith(environment.api);

  if (isApiRoute) {
    req = req.clone({
      setHeaders: {
        Authorization: `Basic ${btoa('user:userPass')}`
      }
    });
  }

  return next(req);
};
