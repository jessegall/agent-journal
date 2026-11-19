<?php

declare(strict_types=1);

namespace App\Desks\Database\Seeders;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Desks\Commands\InstallDesks;
use Illuminate\Database\Seeder;

/**
 * Installs Core's built-in desks as the journal, the same step desks:install runs.
 */
final class DesksSeeder extends Seeder
{
    public function run(EntryDispatchers $dispatchers): void
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesks());
    }
}
