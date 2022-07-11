import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResPlanHeaderRowComponent } from './res-plan-header-row.component';

describe('ResPlanHeaderRowComponent', () => {
  let component: ResPlanHeaderRowComponent;
  let fixture: ComponentFixture<ResPlanHeaderRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResPlanHeaderRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResPlanHeaderRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
