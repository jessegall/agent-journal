<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Policies\SettingPolicy;
use App\Settings\ClosedSettingsAccess;
use App\Settings\Contracts\SettingCommands as SettingCommandsContract;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Contracts\SettingsCatalogue as SettingsCatalogueContract;
use App\Settings\Contracts\SettingsResolver as SettingsResolverContract;
use App\Settings\SettingCodec;
use App\Settings\SettingCommands;
use App\Settings\SettingsCatalogue;
use App\Settings\SettingsResolver;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the settings services; access is denied to everyone unless another provider binds its own policy.
 */
final class SettingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SettingCommandsContract::class, SettingCommands::class);
        $this->app->bindIf(SettingsAccessPolicy::class, ClosedSettingsAccess::class);
        $this->app->singleton(SettingCodec::class);
        // One reader per request or job, so each owner's record is read once there; the writer forgets what it changes.
        $this->app->scoped(SettingsResolver::class);
        $this->app->alias(SettingsResolver::class, SettingsResolverContract::class);
        $this->app->scoped(SettingsCatalogueContract::class, SettingsCatalogue::class);
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyDefinition(
            SettingPolicy::class,
            [AccessType::Edit],
        ));
    }
}
