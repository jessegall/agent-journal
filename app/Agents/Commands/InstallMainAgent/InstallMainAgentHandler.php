<?php

declare(strict_types=1);

namespace App\Agents\Commands\InstallMainAgent;

use App\Agents\Commands\CreateAgent\CreateAgentCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\Agent;
use App\Models\Agents\MainAgentDesignation;
use App\Values\ProfileBase;

final readonly class InstallMainAgentHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(InstallMainAgentCommand $command): void
    {
        if (MainAgentDesignation::isDesignated()) {
            return;
        }

        $main = ProfileBase::mainAgent();
        $actor = $this->commands->run(new CreateAgentCommand($main->label, $main->key, $command->projectId));
        $agent = Agent::query()->findOrFail($actor->id);

        MainAgentDesignation::create($agent);
    }
}
