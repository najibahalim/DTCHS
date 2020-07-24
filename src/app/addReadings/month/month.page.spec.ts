import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AddMonthReadings } from './month.page';

describe('FlatPage', () => {
  let component: AddMonthReadings;
  let fixture: ComponentFixture<AddMonthReadings>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddMonthReadings ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMonthReadings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
