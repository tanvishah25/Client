import { HttpInterceptorFn } from '@angular/common/http';
import { inject} from '@angular/core';
import { AccountService } from '../_services/account.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let accountService=inject(AccountService);

 if(accountService.currentUser()){
  req = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accountService.currentUser().token}`),
  });
 }


  return next(req);
};
