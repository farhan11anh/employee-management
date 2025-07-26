import { Component } from '@angular/core';
import { SHARED_MATERIAL_IMPORTS } from '../../../shared/shared-material';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { combineLatest, debounceTime } from 'rxjs';
import { Employee } from '../../../core/models/employee.model';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { SHARED_ZORRO_MATERIALS } from '../../../shared/shared-zorro-materials';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    ...SHARED_ZORRO_MATERIALS,
    ...SHARED_MATERIAL_IMPORTS,
    PaginationComponent,
  ],
  templateUrl: './employee-list.page.html',
  styleUrl: './employee-list.page.css'
})
export class EmployeeListPage {



  displayedColumns: string[] = [
    'username',
    'name',
    'email',
    'birthDate',
    'basicSalary',
    'group',
    'status',
    'actions',
  ]

  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  // Pagination
  page = 1;
  limit = 5;

  totalFiltered = 0;
  totalPagesArray: number[] = [];



  // Query
  search = '';
  sort = '';
  order: 'asc' | 'desc' = 'asc';

  searchControl = new FormControl('');
  groupControl = new FormControl('');
  statusControl = new FormControl('');

  groups: string[] = ['HR', 'Finance', 'IT', 'Marketing', 'Customer Service'];
  statuses: string[] = ['active', 'inactive'];


  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    // Initialization logic can go here
  }

  ngOnInit() {
    combineLatest([
      this.employeeService.employees,
      this.route.queryParams
    ]).subscribe(([employees, params]) => {
      this.allEmployees = employees;

      // Ambil dari URL
      this.page = +params['page'] || 1;
      this.limit = +params['limit'] || 5;
      this.sort = params['sort'] || '';
      this.order = params['order'] || 'asc';

      this.searchControl.setValue(params['search'] || '', { emitEvent: false });
      this.groupControl.setValue(params['group'] || '', { emitEvent: false });
      this.statusControl.setValue(params['status'] || '', { emitEvent: false });

      this.applyFilter();
    });

    // Observe filters
    this.searchControl.valueChanges.pipe(debounceTime(1000)).subscribe(search => {
      this.onQueryChange({ search, page: 1 });
    });

    this.groupControl.valueChanges.subscribe(group => {
      this.onQueryChange({ group, page: 1 });
    });

    this.statusControl.valueChanges.subscribe(status => {
      this.onQueryChange({ status, page: 1 });
    });
  }

  ngAfterViewInit() {
    console.log('filteredEmployees:', this.filteredEmployees);
  }


  applyFilter() {
    let data = [...this.allEmployees];

    const search = this.searchControl.value?.toLowerCase().trim();
    const group = this.groupControl.value;
    const status = this.statusControl.value;

    if (search) {
      data = data.filter(emp =>
        emp.firstName.toLowerCase().includes(search) &&
        emp.email.toLowerCase().includes(search)
      );
    }

    if (group) {
      data = data.filter(emp => emp.group === group);
    }

    if (status) {
      data = data.filter(emp => emp.status === status);
    }

    // Hitung total hasil filter
    this.totalFiltered = data.length;

    // Sorting
    const sortKey = this.sort as keyof Employee;
    data.sort((a, b) => {
      let valueA = a[sortKey];
      let valueB = b[sortKey];
      // Kustom sorting untuk birthDate
      if (sortKey === 'birthDate') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Kustom sorting untuk name (firstName + lastName)
      if (sortKey === 'firstName') {
        valueA = (a.firstName + ' ' + a.lastName).toLowerCase();
        valueB = (b.firstName + ' ' + b.lastName).toLowerCase();
      }
      const result = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      return this.order === 'asc' ? result : -result;
    });

    // Pagination
    // this.filteredCount = data.length;
    const start = (this.page - 1) * this.limit;
    this.filteredEmployees = data.slice(start, start + this.limit);

    // // Hitung total halaman dan buat array nomor halaman
    // const totalPages = Math.ceil(data.length / this.limit);
    // this.totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }


  // Jika user ganti pagination / limit / sort
  onQueryChange(newParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...newParams },
      queryParamsHandling: 'merge',
    });
  }

  editEmployee(id: number) {
    const queryParams = {
      search: this.searchControl.value,
      group: this.groupControl.value,
      status: this.statusControl.value,
      page: this.page,
      limit: this.limit
    };

    this.router.navigate(['/employees/edit', id], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  deleteEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: `${employee.firstName} ${employee.lastName}`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Deleting employee with ID: `, employee);

        this.employeeService.removeEmployee(employee.id);
        this.toastr.success('Employee deleted successfully', 'Deleted');
      }
    });
  }

  goToPage(newPage: number) {
    this.onQueryChange({ page: newPage });
  }

  onLimitChange(newLimit: number) {
    this.onQueryChange({ limit: newLimit, page: 1 });
  }



  toggleOrder(): 'asc' | 'desc' {
    return this.order === 'asc' ? 'desc' : 'asc';
  }

  changeSort(field: keyof Employee) {
    const newOrder = this.sort === field ? this.toggleOrder() : 'asc';
    this.onQueryChange({ sort: field, order: newOrder, page: 1 });
  }

  addEmployee() {
    this.router.navigate(['/employees/add']);
  }

  viewEmployeeDetail(id: number) {
    this.router.navigate(['/employees', id], {
      queryParamsHandling: 'preserve'
    });
  }

}
