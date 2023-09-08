import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelectComponent } from './file-select.component';

describe('FileSelectComponent', () => {
  let component: FileSelectComponent;
  let fixture: ComponentFixture<FileSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileSelectComponent]
    });
    fixture = TestBed.createComponent(FileSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
