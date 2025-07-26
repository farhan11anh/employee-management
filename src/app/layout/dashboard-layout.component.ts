import { Component } from '@angular/core';
import { SHARED_MATERIAL_IMPORTS } from '../shared/shared-material';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    ...SHARED_MATERIAL_IMPORTS
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
    constructor() {
        // Initialization logic can go here
    }
    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

}
