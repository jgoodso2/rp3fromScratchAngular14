import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResPlanListComponent } from './res-plan-list.component';

describe('ResPlanListComponent', () => {
  let component: ResPlanListComponent;
  let fixture: ComponentFixture<ResPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResPlanListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
