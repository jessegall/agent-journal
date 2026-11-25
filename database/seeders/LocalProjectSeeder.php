<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Commands\Projects\ProvisionLocalProject\ProvisionLocalProjectCommand;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use Illuminate\Config\Repository;
use Illuminate\Database\Seeder;

/**
 * Makes the local app's own project, its Main environment and the seeded owner's grants on it, as an installation
 * that runs agents itself does; seeding again makes nothing twice.
 */
final class LocalProjectSeeder extends Seeder
{
    public function run(Repository $config, JournalCommands $commands, OwnerSeeder $owners): void
    {
        $commands->runAsJournal(
            CommandEntry::HostControl,
            'projects local-provision',
            new ProvisionLocalProjectCommand(
                $owners->owner()->id,
                $config->string('processes.project_key'),
                $config->string('processes.project_label'),
            ),
        );
    }
}
