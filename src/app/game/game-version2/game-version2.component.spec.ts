import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameVersion2Component } from './game-version2.component';

describe('GameVersion2Component', () => {
  let component: GameVersion2Component;
  let fixture: ComponentFixture<GameVersion2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameVersion2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameVersion2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
