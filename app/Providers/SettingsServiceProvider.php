<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Settings\SettingCommands as SettingCommandsContract;
use App\Contracts\Settings\SettingsAccessPolicy;
use App\Contracts\Settings\SettingsCatalogue as SettingsCatalogueContract;
use App\Contracts\Settings\SettingsResolver as SettingsResolverContract;
use App\Enums\Agents\AccessType;
use App\Policies\SettingPolicy;
use App\Support\ClosedSettingsAccess;
use App\Support\SettingCodec;
use App\Support\SettingCommands;
use App\Support\SettingsCatalogue;
use App\Support\SettingsResolver;
use App\Values\PolicyDefinition;
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
