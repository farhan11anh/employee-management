import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SHARED_MATERIAL_IMPORTS } from '../../../shared/shared-material';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, debounceTime, Subscription } from 'rxjs';
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
export class EmployeeListPage implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'username',
    'name',
    'email',
    'birthDate',
    'basicSalary',
    'group',
    'status',
    'actions',
  ];

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

  // Form Controls
  searchControl = new FormControl('');
  groupControl = new FormControl('');
  statusControl = new FormControl('');

  // Options
  groups: string[] = ['HR', 'Finance', 'IT', 'Marketing', 'Customer Service'];
  statuses: string[] = ['active', 'inactive'];

  // Subscriptions
  private dataSubscription!: Subscription;
  private searchSubscription!: Subscription;
  private groupSubscription!: Subscription;
  private statusSubscription!: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setupDataSubscription();
    this.setupFilterSubscriptions();
  }

  ngAfterViewInit(): void {
    console.log('filteredEmployees:', this.filteredEmployees);
  }


  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  private setupDataSubscription(): void {
    this.dataSubscription = combineLatest([
      this.employeeService.employees,
      this.route.queryParams
    ]).subscribe(([employees, params]) => {
      this.allEmployees = employees;
      this.updateFromQueryParams(params);
      this.applyFilter();
    });
  }

  private setupFilterSubscriptions(): void {
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(search => {
        this.onQueryChange({ search, page: 1 });
      });

    this.groupSubscription = this.groupControl.valueChanges.subscribe(group => {
      this.onQueryChange({ group, page: 1 });
    });

    this.statusSubscription = this.statusControl.valueChanges.subscribe(status => {
      this.onQueryChange({ status, page: 1 });
    });
  }

  private cleanupSubscriptions(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.groupSubscription) {
      this.groupSubscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  private updateFromQueryParams(params: any): void {
    this.page = +params['page'] || 1;
    this.limit = +params['limit'] || 5;
    this.sort = params['sort'] || '';
    this.order = params['order'] || 'asc';

    this.searchControl.setValue(params['search'] || '', { emitEvent: false });
    this.groupControl.setValue(params['group'] || '', { emitEvent: false });
    this.statusControl.setValue(params['status'] || '', { emitEvent: false });
  }

  applyFilter(): void {
    let data = [...this.allEmployees];
    const search = this.searchControl.value?.toLowerCase().trim();
    const group = this.groupControl.value;
    const status = this.statusControl.value;

    // Filtering
    data = this.applyFilters(data, search, group, status);

    // Sorting
    data = this.applySorting(data);

    // Pagination
    this.applyPagination(data);
  }

  private applyFilters(data: Employee[], search?: string | null, group?: string | null, status?: string | null): Employee[] {
    let filteredData = [...data];

    if (search) {
      filteredData = filteredData.filter(emp =>
        emp.firstName.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search)
      );
    }

    if (group) {
      filteredData = filteredData.filter(emp => emp.group === group);
    }

    if (status) {
      filteredData = filteredData.filter(emp => emp.status === status);
    }

    this.totalFiltered = filteredData.length;
    return filteredData;
  }

  private applySorting(data: Employee[]): Employee[] {
    const sortKey = this.sort as keyof Employee;
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      let valueA = this.getSortValue(a, sortKey);
      let valueB = this.getSortValue(b, sortKey);

      const result = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      return this.order === 'asc' ? result : -result;
    });
  }

  private getSortValue(employee: Employee, sortKey: keyof Employee): any {
    if (sortKey === 'birthDate') {
      return new Date(employee[sortKey]).getTime();
    }
    if (sortKey === 'firstName') {
      return (employee.firstName + ' ' + employee.lastName).toLowerCase();
    }
    return employee[sortKey];
  }

  private applyPagination(data: Employee[]): void {
    const start = (this.page - 1) * this.limit;
    this.filteredEmployees = data.slice(start, start + this.limit);
  }

  onQueryChange(newParams: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...newParams },
      queryParamsHandling: 'merge',
    });
  }

  editEmployee(id: number): void {
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

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: `${employee.firstName} ${employee.lastName}`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.removeEmployee(employee.id);
        this.toastr.success('Employee deleted successfully', 'Deleted');
      }
    });
  }

  goToPage(newPage: number): void {
    this.onQueryChange({ page: newPage });
  }

  onLimitChange(newLimit: number): void {
    this.onQueryChange({ limit: newLimit, page: 1 });
  }

  toggleOrder(): 'asc' | 'desc' {
    return this.order === 'asc' ? 'desc' : 'asc';
  }

  changeSort(field: keyof Employee): void {
    const newOrder = this.sort === field ? this.toggleOrder() : 'asc';
    this.onQueryChange({ sort: field, order: newOrder, page: 1 });
  }

  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  viewEmployeeDetail(id: number): void {
    this.router.navigate(['/employees', id], {
      queryParamsHandling: 'preserve'
    });
  }
}