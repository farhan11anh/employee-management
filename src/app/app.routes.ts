import { Routes } from '@angular/router';
import { LoginPage } from './auth/login/login.page';
import { authGuard } from './auth/guards/auth.guard';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { LayoutComponent } from './layout/layout.component';
// import { EmployeeAddPage } from './pages/employees/add/employee-add.page';
// import { EmployeeDetailPage } from './pages/employees/detail/employee-detail.page';

export const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'login', 
    //     pathMatch: 'full',
    // },
    { 
        path: 'login',
        component: LoginPage,
    },
{
  path: '',
  component: DashboardLayoutComponent,
  canActivate: [authGuard], // Apply auth guard to this route
  children: [
    {
        path: '',
        loadComponent: () => 
            import('./pages/dashboard/dashboard.component')
                .then(m => m.DashboardComponent)
    },
    {
      path: 'employees',
      loadComponent: () =>
        import('./pages/employees/list/employee-list.page')
          .then(m => m.EmployeeListPage)
    },
    {
      path: 'employees/add',
      loadComponent: () =>
        import('./pages/employees/add/employee-add.page')
          .then(m => m.EmployeeAddPage)
    },
    {
      path: 'employees/:id',
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
