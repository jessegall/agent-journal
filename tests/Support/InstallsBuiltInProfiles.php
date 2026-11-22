<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\InstallBuiltInProfiles\InstallBuiltInProfilesCommand as InstallCommand;
use App\Enums\CommandEntry;
use App\Support\ActorStore;
use App\Support\EntryDispatchers;

/**
 * Activates the journal's built-in profiles before each test, for tests that write session rows pinned to them.
 */
trait InstallsBuiltInProfiles
{
    protected function setUpInstallsBuiltInProfiles(): void
    {
        $host = $this->app->make(EntryDispatchers::class)->for(CommandEntry::HostControl);
        $this->app->make(ActorStore::class)->actAsSystem('test', fn (): mixed => $host->run(new InstallCommand()));
    }
}
