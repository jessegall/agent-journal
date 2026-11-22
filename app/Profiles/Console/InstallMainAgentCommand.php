<?php

declare(strict_types=1);

namespace App\Profiles\Console;

use App\Agents\Models\MainAgentDesignation;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Profiles\Commands\InstallMainAgent\InstallMainAgentCommand as InstallMainAgent;
use Illuminate\Console\Command;

final class InstallMainAgentCommand extends Command
{
    protected $signature = 'agents:install';

    protected $description = 'Create the installation main agent and designate it, once';

    public function handle(EntryDispatchers $dispatchers): int
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'main agent install', new InstallMainAgent());
        $this->info(sprintf('The main agent is %s.', MainAgentDesignation::designatedAgent()->name));

        return self::SUCCESS;
    }
}
