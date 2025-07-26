import { Component } from "@angular/core";
import { SummaryCardsComponent } from "../../components/summary/summary-cards.component";
import { SHARED_MATERIAL_IMPORTS } from "../../shared/shared-material";
import { SHARED_ZORRO_MATERIALS } from "../../shared/shared-zorro-materials";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    SummaryCardsComponent,
    ...SHARED_MATERIAL_IMPORTS,
    ...SHARED_ZORRO_MATERIALS
  ]
})

export class DashboardComponent {
  // This component can be used to manage the dashboard layout and functionality
  // Currently, it serves as a placeholder for the dashboard view
}