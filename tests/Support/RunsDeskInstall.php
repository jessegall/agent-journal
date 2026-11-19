<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Desks\Commands\InstallDesks;

/**
 * Installs the journal's desks as the host does when the journal starts.
 */
trait RunsDeskInstall
{
    private function installDesks(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesks());
    }
}
