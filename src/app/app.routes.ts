import { Routes } from '@angular/router';
import { LoginPage } from './auth/login/login.page';
import { EmployeeListPage } from './pages/employees/list/employee-list.page';
// import { EmployeeAddPage } from './pages/employees/add/employee-add.page';
// import { EmployeeDetailPage } from './pages/employees/detail/employee-detail.page';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login', 
        pathMatch: 'full',
    },
    { 
        path: 'login',
        component: LoginPage,
    },
{
  path: 'employees',
  children: [
    {
      path: '',
      component: EmployeeListPage,
    },
    {
      path: 'add',
      loadComponent: () =>
        import('./pages/employees/add/employee-add.page')
          .then(m => m.EmployeeAddPage)
    },
    {
      path: ':id',
      loadComponent: () =>
        import('./pages/employees/detail/employee-detail.page')
          .then(m => m.EmployeeDetailPage)
    }
  ]
}

    // {
    //     path: 'eployees/add',
    //     loadComponent: () => 
    //         import('./pages/employees/add/employee-add.page')
    //             .then(m => m.EmployeeAddPage)
    // },
    // {
    //     path: 'employees/detail/:id',
    //     loadComponent: () =>
    //         import('./pages/employees/detail/employee-detail.page')
    //             .then(m => m.EmployeeDetailPage)
    // }
];
