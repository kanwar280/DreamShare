import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDreamComponent } from './post-dream.component';

describe('PostDreamComponent', () => {
  let component: PostDreamComponent;
  let fixture: ComponentFixture<PostDreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
