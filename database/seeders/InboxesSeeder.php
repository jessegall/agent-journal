<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Contracts\Bus\JournalCommands;
use App\Enums\CommandEntry;
use Illuminate\Database\Seeder;

final class InboxesSeeder extends Seeder
{
    public function run(JournalCommands $dispatchers): void
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());
    }
}
