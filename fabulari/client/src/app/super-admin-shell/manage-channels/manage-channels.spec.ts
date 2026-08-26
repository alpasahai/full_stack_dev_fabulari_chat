import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageChannels } from './manage-channels';

describe('ManageChannels', () => {
  let component: ManageChannels;
  let fixture: ComponentFixture<ManageChannels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageChannels],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageChannels);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
