<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Models\Access\User;
use App\Projects\Commands\ProvisionLocalProject\ProvisionLocalProjectCommand;
use Illuminate\Config\Repository;
use Illuminate\Database\Seeder;

/**
 * Makes the local app's own project, its Main environment and the seeded owner's grants on it, as an installation
 * that runs agents itself does; seeding again makes nothing twice.
 */
final class LocalProjectSeeder extends Seeder
{
    public function run(User $owner, Repository $config, JournalCommands $commands): void
    {
        $commands->runAsJournal(
            CommandEntry::HostControl,
            'projects local-provision',
            new ProvisionLocalProjectCommand(
                $owner->id,
                $config->string('journal.processes.project_key'),
                $config->string('journal.processes.project_label'),
            ),
        );
    }
}
