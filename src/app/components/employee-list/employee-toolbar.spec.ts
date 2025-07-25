import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeToolbar } from './employee-toolbar';

describe('EmployeeToolbar', () => {
  let component: EmployeeToolbar;
  let fixture: ComponentFixture<EmployeeToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
