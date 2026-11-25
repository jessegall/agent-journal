<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\Agents\InstallMainAgent\InstallMainAgentCommand as InstallMainAgent;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\MainAgentDesignation;
use App\Models\Projects\Project;
use App\Support\JournalCommands;
use Illuminate\Config\Repository;
use Illuminate\Console\Command;

final class InstallMainAgentCommand extends Command
{
    protected $signature = 'agents:install';

    protected $description = 'Create the installation main agent and designate it, once';

    public function handle(JournalCommands $dispatchers, Repository $config): int
    {
        if (! $config->boolean('processes.local_execution')) {
            $this->info('Local execution is off, so no main agent is made.');

            return self::SUCCESS;
        }

        $project = Project::findLocal();
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'main agent install', new InstallMainAgent($project->id));
        $this->info(sprintf('The main agent is %s.', MainAgentDesignation::resolveDesignatedAgent()->name));

        return self::SUCCESS;
    }
}
