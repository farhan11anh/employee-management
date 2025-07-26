import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { SHARED_MATERIAL_IMPORTS } from '../../shared/shared-material';
import { SHARED_ZORRO_MATERIALS } from '../../shared/shared-zorro-materials';

@Component({
  selector: 'app-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss'],
    standalone: true,
    imports: [
        ...SHARED_MATERIAL_IMPORTS,
        ...SHARED_ZORRO_MATERIALS
    ]
})
export class SummaryCardsComponent implements OnInit {
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    departments: string[];
    avgSalary: number;
  } = {
    totalEmployees: 0,
    activeEmployees: 0,
    departments: [],
    avgSalary: 0
  };

  recentEmployees: any[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    // Load statistics
    this.stats = this.employeeService.getStatistics();
    
    // Load recent employees
    this.employeeService.getRecentEmployees().subscribe(employees => {
      this.recentEmployees = employees;
    });
  }
}