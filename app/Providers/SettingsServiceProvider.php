<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Settings\SettingCommands;
use App\Contracts\Settings\SettingsAccessPolicy;
use App\Contracts\Settings\SettingsCatalogue;
use App\Contracts\Settings\SettingsResolver;
use App\Enums\Agents\AccessType;
use App\Policies\SettingPolicy;
use App\Support\ClosedSettingsAccess;
use App\Support\DatabaseSettingsCatalogue;
use App\Support\DatabaseSettingsResolver;
use App\Support\RegisteredSettingCommands;
use App\Support\SettingCodec;
use App\Values\PolicyDefinition;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the settings services; access is denied to everyone unless another provider binds its own policy.
 */
final class SettingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SettingCommands::class, RegisteredSettingCommands::class);
        $this->app->bindIf(SettingsAccessPolicy::class, ClosedSettingsAccess::class);
        $this->app->singleton(SettingCodec::class);
        // One reader per request or job, so each owner's record is read once there; the writer forgets what it changes.
        $this->app->scoped(DatabaseSettingsResolver::class);
        $this->app->alias(DatabaseSettingsResolver::class, SettingsResolver::class);
        $this->app->scoped(SettingsCatalogue::class, DatabaseSettingsCatalogue::class);
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyDefinition(
            SettingPolicy::class,
            [AccessType::Edit],
        ));
    }
}
