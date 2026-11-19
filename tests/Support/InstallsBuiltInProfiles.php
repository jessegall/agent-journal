<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Support\ActorStore;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Profiles\Commands\InstallBuiltInProfiles as InstallCommand;

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
