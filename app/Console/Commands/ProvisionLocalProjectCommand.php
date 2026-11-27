<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Access\AccessSettings;
use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Projects\Commands\ProvisionLocalProject\ProvisionLocalProjectCommand as ProvisionLocalProject;
use Illuminate\Console\Command;
use Illuminate\Container\Attributes\Config;

/**
 * Makes the installation's own project, its Main environment and the owner's grants on it, once the owner exists and
 * while the installation runs agents itself; run again, it makes nothing twice.
 */
final class ProvisionLocalProjectCommand extends Command
{
    protected $signature = 'projects:local-provision';

    protected $description = 'Create the local project, its Main environment and the owner\'s grants on it';

    public function handle(
        #[Config('journal.processes.local_execution')]
        bool $isLocalExecution,
        #[Config('journal.processes.project_key')]
        string $projectKey,
        #[Config('journal.processes.project_label')]
        string $projectLabel,
        AccessSettings $access,
        JournalCommands $commands,
    ): int {
        if (! $isLocalExecution) {
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
                $projectKey,
                $projectLabel,
            ),
        );

        return self::SUCCESS;
    }
}
