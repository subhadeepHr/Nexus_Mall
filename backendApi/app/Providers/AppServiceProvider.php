<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Define the API rate limiter
        RateLimiter::for('api', function (Request $request) {
            // You can customize the rate limit here. For example:
            // 60 requests per minute for guests and authenticated users.
            return $request->user()
                ? Limit::perMinute(60)->by($request->user()->id)  // For authenticated users
                : Limit::perMinute(60);  // For guests (unauthenticated users)
        });

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
        
    }
}
