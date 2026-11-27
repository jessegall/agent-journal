<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\InstallMainAgent\InstallMainAgentCommand as InstallMainAgent;
use App\Bus\JournalCommands;
use App\Models\Agents\MainAgentDesignation;
use App\Models\Projects\Project;
use Illuminate\Console\Command;
use Illuminate\Container\Attributes\Config;

final class InstallMainAgentCommand extends Command
{
    protected $signature = 'agents:install';

    protected $description = 'Create the installation main agent and designate it, once';

    public function handle(
        JournalCommands $dispatchers,
        #[Config('processes.local_execution')]
        bool $isLocalExecution,
    ): int {
        if (! $isLocalExecution) {
            $this->info('Local execution is off, so no main agent is made.');

            return self::SUCCESS;
        }

        $project = Project::findLocal();
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'main agent install', new InstallMainAgent($project->id));
        $this->info(sprintf('The main agent is %s.', MainAgentDesignation::resolveDesignatedAgent()->name));

        return self::SUCCESS;
    }
}
