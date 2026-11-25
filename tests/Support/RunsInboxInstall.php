<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Enums\Accounts\CommandEntry;
use App\Support\EntryDispatchers;

/**
 * Installs the journal's inboxes as the host does when the journal starts.
 */
trait RunsInboxInstall
{
    private function installInboxes(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());
    }
}
