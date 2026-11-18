<?php

declare(strict_types=1);

namespace App\Profiles\Providers;

use App\Profiles\Console\ProfileListCommand;
use App\Profiles\Console\ProfileShowCommand;
use App\Profiles\Contracts\ProfileReader;
use App\Profiles\Readers\ProfileRecords;
use Illuminate\Support\ServiceProvider;

/**
 * Binds Core's profile reader to the stored profile revisions and registers the profile console reads.
 */
final class ProfilesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProfileReader::class, ProfileRecords::class);
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([ProfileListCommand::class, ProfileShowCommand::class]);
        }
    }
}
