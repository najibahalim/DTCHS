import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AddReadingsHome } from './home.page';

describe('FlatPage', () => {
  let component: AddReadingsHome;
  let fixture: ComponentFixture<AddReadingsHome>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddReadingsHome ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReadingsHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
