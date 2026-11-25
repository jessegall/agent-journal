<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\Projects\ProvisionLocalProject\ProvisionLocalProjectCommand as ProvisionLocalProject;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Support\Access\AccessSettings;
use Illuminate\Config\Repository;
use Illuminate\Console\Command;

/**
 * Makes the installation's own project, its Main environment and the owner's grants on it, once the owner exists and
 * while the installation runs agents itself; run again, it makes nothing twice.
 */
final class ProvisionLocalProjectCommand extends Command
{
    protected $signature = 'projects:local-provision';

    protected $description = 'Create the local project, its Main environment and the owner\'s grants on it';

    public function handle(Repository $config, AccessSettings $access, JournalCommands $commands): int
    {
        if (! $config->boolean('processes.local_execution')) {
            $this->info('Local execution is off, so no local project is made.');

            return self::SUCCESS;
        }

        $ownerId = $access->ownerId;

        if ($ownerId === null) {
            $this->info('No owner account exists yet, so no local project is made.');

            return self::SUCCESS;
        }

        $commands->runAsJournal(
            CommandEntry::HostControl,
            'projects local-provision',
            new ProvisionLocalProject(
                $ownerId,
                $config->string('processes.project_key'),
                $config->string('processes.project_label'),
            ),
        );

        return self::SUCCESS;
    }
}
