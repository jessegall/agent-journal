<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\Profiles\InstallBuiltInProfiles\InstallBuiltInProfilesCommand as InstallCommand;
use App\Enums\Accounts\CommandEntry;
use App\Support\ActorStore;
use App\Support\JournalCommands;

/**
 * Activates the journal's built-in profiles before each test, for tests that write session rows pinned to them.
 */
trait InstallsBuiltInProfiles
{
    protected function setUpInstallsBuiltInProfiles(): void
    {
        $host = $this->app->make(JournalCommands::class)->for(CommandEntry::HostControl);
        $this->app->make(ActorStore::class)->actAsSystem('test', fn (): mixed => $host->run(new InstallCommand()));
    }
}
