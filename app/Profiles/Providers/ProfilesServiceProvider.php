<?php

declare(strict_types=1);

namespace App\Profiles\Providers;

use App\Profiles\Console\ProfileActivateCommand;
use App\Profiles\Console\ProfileListCommand;
use App\Profiles\Console\ProfileRevokeCommand;
use App\Profiles\Console\ProfileShowCommand;
use App\Profiles\Contracts\KnownOperations;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Resolvers\ProfilePrograms;
use App\Profiles\Resolvers\ProfileRecords;
use App\Profiles\Support\ConfiguredOperations;
use Illuminate\Support\ServiceProvider;

/**
 * Binds Core's profile reader and launch selection to the stored profile revisions, loads the main launch route and
 * registers the profile console commands.
 */
final class ProfilesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProfileResolver::class, ProfileRecords::class);
        $this->app->bind(KnownOperations::class, ConfiguredOperations::class);
        $this->app->bind(ProfileSelections::class, ProfilePrograms::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/web.php');

        if ($this->app->runningInConsole()) {
            $this->commands([
                ProfileListCommand::class,
                ProfileShowCommand::class,
                ProfileActivateCommand::class,
                ProfileRevokeCommand::class,
            ]);
        }
    }
}
