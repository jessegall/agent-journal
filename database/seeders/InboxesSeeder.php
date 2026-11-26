<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Inboxes\Commands\InstallInboxes\InstallInboxesCommand;
use Illuminate\Database\Seeder;

final class InboxesSeeder extends Seeder
{
    public function run(JournalCommands $dispatchers): void
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());
    }
}
