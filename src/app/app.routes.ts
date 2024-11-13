import { Routes } from '@angular/router';
import { PostDreamComponent } from './post-dream/post-dream.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'postdreams', component: PostDreamComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent}
];
