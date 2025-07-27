import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { SHARED_MATERIAL_IMPORTS } from '../../../shared/shared-material';
import { SHARED_ZORRO_MATERIALS } from '../../../shared/shared-zorro-materials';

@Component({
  selector: 'app-employee-detail',
  imports: [
    ...SHARED_MATERIAL_IMPORTS,
    ...SHARED_ZORRO_MATERIALS
  ],
  templateUrl: './employee-detail.page.html',
  styleUrl: './employee-detail.page.css'
})
export class EmployeeDetailPage implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  employee: Employee | undefined;
  previousQueryParams: any = {};
  private routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    console.log('ngOnInit called');
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.previousQueryParams = this.route.snapshot.queryParams;

    this.employeeService.getEmployees().subscribe(employees => {
      this.employee = employees.find(e => e.id === id);
    });

    this.routeSub = this.route.params.subscribe(params => {
      console.log('Route params changed:', params);
    });
  }

  ngDoCheck() {
    console.log('ngDoCheck called - change detection cycle');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called - view initialized');
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  backToList() {
    this.router.navigate(['/employees'], {
      queryParams: this.previousQueryParams
    });
  }
}