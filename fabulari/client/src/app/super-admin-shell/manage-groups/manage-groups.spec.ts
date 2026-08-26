import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageGroups } from './manage-groups';

describe('ManageGroups', () => {
  let component: ManageGroups;
  let fixture: ComponentFixture<ManageGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageGroups],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageGroups);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
