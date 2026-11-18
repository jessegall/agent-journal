<?php

declare(strict_types=1);

namespace App\Settings\Providers;

use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Support\DenyAllSettingsAccess;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the settings services; access is denied to everyone unless another provider binds its own policy.
 */
final class SettingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bindIf(SettingsAccessPolicy::class, DenyAllSettingsAccess::class);
    }
}
