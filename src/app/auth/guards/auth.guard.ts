import { CanActivateFn } from "@angular/router";
import { Inject } from "@angular/core";
import { Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
    const router = Inject(Router);

    const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists in localStorage

    if(!isLoggedIn) {
        // If not logged in, redirect to login page
        router.navigate(['/login']);
        return false;
    }

    return true; // Allow access to the route
}