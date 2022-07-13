import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResPlanHomeComponent } from './res-plan-home.component';

describe('ResPlanHomeComponent', () => {
  let component: ResPlanHomeComponent;
  let fixture: ComponentFixture<ResPlanHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResPlanHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResPlanHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
