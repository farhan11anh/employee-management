import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_MATERIAL_IMPORTS } from '../../shared/shared-material';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
  imports: [
    ...SHARED_MATERIAL_IMPORTS
  ]
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() limit = 5;
  @Input() total = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  get visiblePages(): (number | -1)[] {
    const total = this.totalPages;
    const current = this.page;
    const pages: (number | -1)[] = [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current > 4) pages.push(-1); // ...

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 3) pages.push(-1); // ...

    pages.push(total);

    return pages;
  }

  changePage(p: number) {
    if (p !== -1 && p !== this.page) {
      this.pageChange.emit(p);
    }
  }

  onPrevious() {
    if (this.page > 1) this.pageChange.emit(this.page - 1);
  }

  onNext() {
    if (this.page < this.totalPages) this.pageChange.emit(this.page + 1);
  }

  onLimitChange(event: any) {
    this.limitChange.emit(event.value);
  }
}
