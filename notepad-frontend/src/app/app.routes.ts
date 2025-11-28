import { Routes } from '@angular/router';
import { MainArea } from './components/main-area/main-area';

export const routes: Routes = [
    { path: '', component: MainArea },
    { path: '**', redirectTo: '' }
];
