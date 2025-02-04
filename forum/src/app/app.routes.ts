import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ThemesListComponent } from './theme/themes-list/themes-list.component';
import { AddThemeComponent } from './theme/add-theme/add-theme.component';
import { MainComponent } from './main/main/main.component';
import { CurrentThemeComponent } from './theme/current-theme/current-theme.component';
import { AuthGuard } from './guards/auth.guard';
import { ErrorMsgComponent } from './core/error-msg/error-msg.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent)
    },
    {
        path: 'register', 
        loadComponent: () => import('../app/user/register/register.component').then((c) => c.RegisterComponent)
    },
    {
        path: 'login', 
        loadComponent: () => import('../app/user/login/login.component').then((c) => c.LoginComponent)
    },
    {
        path: 'profile', 
        loadComponent: () => import('../app/user/profile/profile.component').then((c) => c.ProfileComponent)
    },
    {path: 'themes', children: [
        {
            path: '', 
            loadComponent: () => import('../app/main/main/main.component').then((c) => c.MainComponent)
        },
        {
            path: ':themeId', 
            loadComponent: () => import('../app/theme/current-theme/current-theme.component').then((c) => c.CurrentThemeComponent), 
            canActivate: [AuthGuard]
        }
    ]},
    {
        path: 'add-theme',  
        loadComponent: () => import('./theme/add-theme/add-theme.component').then((c) => c.AddThemeComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'error', 
        loadComponent: () => import('./core/error-msg/error-msg.component').then((c) => c.ErrorMsgComponent),
    },
    {
        path: '404', 
        loadComponent: () => import('./error/error.component').then((c) => c.ErrorComponent)
    },
    {path: '**', redirectTo: '/404', pathMatch: 'full'},
];
