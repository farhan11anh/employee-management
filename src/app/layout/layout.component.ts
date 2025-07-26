import { Component } from "@angular/core";
import { SHARED_ZORRO_MATERIALS } from "../shared/shared-zorro-materials";
import { SHARED_MATERIAL_IMPORTS } from "../shared/shared-material";

@Component
({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,imports: [
    ...SHARED_ZORRO_MATERIALS,
    ...SHARED_MATERIAL_IMPORTS
  ]
    // Import shared modules here if needed

})  

export class LayoutComponent {
  constructor() {
    // Initialization logic can go here
  }

  isCollapsed = false;

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}