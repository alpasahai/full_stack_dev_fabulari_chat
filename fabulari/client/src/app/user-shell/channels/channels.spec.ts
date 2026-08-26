import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Channels } from './channels';

describe('Channels', () => {
  let component: Channels;
  let fixture: ComponentFixture<Channels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Channels],
    }).compileComponents();

    fixture = TestBed.createComponent(Channels);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
