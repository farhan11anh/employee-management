import { Component } from '@angular/core';
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
export class EmployeeDetailPage {
  employee: Employee | undefined;
  previousQueryParams: any = {};

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.previousQueryParams = this.route.snapshot.queryParams;

    this.employeeService.getEmployees().subscribe(employees => {
      this.employee = employees.find(e => e.id === id);
    });
  }

  backToList() {
    // Navigasi kembali dengan membawa query params sebelumnya
    this.router.navigate(['/employees'], {
      queryParams: this.previousQueryParams
    });
  }
}
