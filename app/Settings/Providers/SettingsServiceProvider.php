<?php

declare(strict_types=1);

namespace App\Settings\Providers;

use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Contracts\SettingsReader;
use App\Settings\Support\DatabaseSettingsCatalogue;
use App\Settings\Support\DatabaseSettingsReader;
use App\Settings\Support\DenyAllSettingsAccess;
use App\Settings\Support\SettingCodec;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the settings services; access is denied to everyone unless another provider binds its own policy.
 */
final class SettingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bindIf(SettingsAccessPolicy::class, DenyAllSettingsAccess::class);
        $this->app->singleton(SettingCodec::class);
        // One reader per request or job, so each owner's record is read once there; the writer forgets what it changes.
        $this->app->scoped(DatabaseSettingsReader::class);
        $this->app->alias(DatabaseSettingsReader::class, SettingsReader::class);
        $this->app->scoped(SettingsCatalogue::class, DatabaseSettingsCatalogue::class);
    }
}
