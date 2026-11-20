<?php

declare(strict_types=1);

namespace App\Settings\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Operations\Enums\AccessType;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Support\DatabaseSettingsCatalogue;
use App\Settings\Support\DatabaseSettingsResolver;
use App\Settings\Support\DenyAllSettingsAccess;
use App\Settings\Support\RegisteredSettingCommands;
use App\Settings\Support\SettingCodec;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the settings services; access is denied to everyone unless another provider binds its own policy.
 */
final class SettingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SettingCommands::class, RegisteredSettingCommands::class);
        $this->app->bindIf(SettingsAccessPolicy::class, DenyAllSettingsAccess::class);
        $this->app->singleton(SettingCodec::class);
        // One reader per request or job, so each owner's record is read once there; the writer forgets what it changes.
        $this->app->scoped(DatabaseSettingsResolver::class);
        $this->app->alias(DatabaseSettingsResolver::class, SettingsResolver::class);
        $this->app->scoped(SettingsCatalogue::class, DatabaseSettingsCatalogue::class);
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyRegistration(
            SettingPolicy::class,
            [AccessType::Edit],
            ownerOnly: [AccessType::Edit],
        ));
    }
}
