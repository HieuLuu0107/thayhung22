<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->routes(function () {
            // API route
            Route::middleware(['api', 'json'])
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // Web route cho /
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
