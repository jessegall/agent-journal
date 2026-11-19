<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\InstallBuiltInProfiles as InstallCommand;

/**
 * Activates the journal's built-in profiles before each test, for tests that write session rows pinned to them.
 */
trait InstallsBuiltInProfiles
{
    protected function setUpInstallsBuiltInProfiles(): void
    {
        $commands = $this->app->make(CommandBus::class);
        $this->app->make(ActorStore::class)->actAsSystem('test', fn (): mixed => $commands->run(new InstallCommand()));
    }
}
