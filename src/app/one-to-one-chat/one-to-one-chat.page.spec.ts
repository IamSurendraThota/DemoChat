import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneToOneChatPage } from './one-to-one-chat.page';

describe('OneToOneChatPage', () => {
  let component: OneToOneChatPage;
  let fixture: ComponentFixture<OneToOneChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneToOneChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneToOneChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
