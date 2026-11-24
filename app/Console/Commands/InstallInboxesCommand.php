<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand as InstallInboxes;
use App\Contracts\Bus\JournalCommands;
use App\Enums\CommandEntry;
use Illuminate\Console\Command;

final class InstallInboxesCommand extends Command
{
    protected $signature = 'inboxes:install';

    protected $description = 'Install the inboxes Core needs: main and the source inboxes';

    public function handle(JournalCommands $dispatchers): int
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxes());

        return self::SUCCESS;
    }
}
