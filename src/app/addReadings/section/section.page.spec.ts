import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AddSectionReadings } from './section.page';

describe('FlatPage', () => {
  let component: AddSectionReadings;
  let fixture: ComponentFixture<AddSectionReadings>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSectionReadings ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSectionReadings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
