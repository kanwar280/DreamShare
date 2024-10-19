import { Routes } from '@angular/router';
import { PostDreamComponent } from './post-dream/post-dream.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'postdreams', component: PostDreamComponent}
];
