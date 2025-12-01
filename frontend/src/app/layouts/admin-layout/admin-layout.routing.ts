import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    {
        path: '',
        children: [
            {
                path: 'theaters',
                canActivate: [AuthenticationGuard], // Protege la ruta para que solo usuarios autenticados puedan acceder mediante un guardian
                loadChildren: () => import('src/app/pages/theaters/theaters.module').then(m => m.TheatersModule)
            },
            {
                path: 'orders',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/orders/orders.module').then(m => m.OrdersModule)
            },
            {
                path: 'issues',
                loadChildren: () => import('src/app/pages/issue/issue.module')
                    .then(m => m.IssueModule)
            },
            {
                path: 'photos',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/photos/photos.module').then(m => m.PhotosModule)
            },
            {
                path: 'products',
                canActivate: [AuthenticationGuard], // Protege la ruta para que solo usuarios autenticados puedan acceder mediante un guardian
                loadChildren: () => import('src/app/pages/products/products.module').then(m => m.ProductsModule)
            },
            {
                path: 'menus',
                canActivate: [AuthenticationGuard], // Protege la ruta para que solo usuarios autenticados puedan acceder mediante un guardian
                loadChildren: () => import('src/app/pages/menus/menus.module').then(m => m.MenusModule)
            },
            {
                path: 'restaurants',
                canActivate: [AuthenticationGuard], // Protege la ruta para que solo usuarios autenticados puedan acceder mediante un guardian
                loadChildren: () => import('src/app/pages/restaurants/restaurants.module').then(m => m.RestaurantsModule)
            },
            {
            path: 'motorcycles',
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
                import('src/app/pages/motorcycles/motorcycles.module')
                    .then(m => m.MotorcyclesModule)
            },
            {
                path: 'drivers',
                canActivate: [AuthenticationGuard],
                loadChildren: () =>
                    import('src/app/pages/drivers/drivers.module')
                        .then(m => m.DriversModule)
            },
            {
                path: 'shifts',
                canActivate: [AuthenticationGuard],
                loadChildren: () =>
                    import('src/app/pages/shifts/shifts.module')
                    .then(m => m.ShiftsModule)
            },
            {
                path: 'customers',
                canActivate: [AuthenticationGuard], // Protege la ruta para que solo usuarios autenticados puedan acceder mediante un guardian
                loadChildren: () => import('src/app/pages/customers/customers.module').then(m => m.CustomersModule)
            },
            {
                path: 'orders',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/orders/orders.module').then(m => m.OrdersModule)
            },
            {
                path: 'issues',
                loadChildren: () => import('src/app/pages/issue/issue.module')
                    .then(m => m.IssueModule)
            },
            {
                path: 'photos',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/photos/photos.module').then(m => m.PhotosModule)
            },
            {
                path: 'addresses',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/addresses/addresses.module').then(m => m.AddressesModule)
            },
            {
                path: 'charts',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/charts/charts.module').then(m => m.ChartsModule)
            },

        ]
    }
];
