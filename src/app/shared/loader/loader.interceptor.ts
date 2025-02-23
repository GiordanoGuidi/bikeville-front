import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
// Se l'header "Skip-Loader" è presente, non modificare lo stato del loader
// if (req.headers.has('Skip-Loader')) {
//   return next(req);
// }
//Inietto il servizio senza utilizzare il costruttore
// const loaderService = inject(LoaderService);
//Mostro il loader
// loaderService.show();
// return next(req).pipe(
//   // Nasconde il loader quando la richiesta termina
//   finalize(() => loaderService.hide())
// );
// };
