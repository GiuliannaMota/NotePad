import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteGallery } from './note-gallery';

describe('NoteGallery', () => {
  let component: NoteGallery;
  let fixture: ComponentFixture<NoteGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
