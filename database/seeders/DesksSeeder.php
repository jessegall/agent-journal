<?php

declare(strict_types=1);

namespace App\Desks\Database\Seeders;

use App\Commands\InstallDesks\InstallDesksCommand;
use App\Enums\CommandEntry;
use App\Support\EntryDispatchers;
use Illuminate\Database\Seeder;

/**
 * Installs Core's built-in desks as the journal, the same step desks:install runs.
 */
final class DesksSeeder extends Seeder
{
    public function run(EntryDispatchers $dispatchers): void
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesksCommand());
    }
}
