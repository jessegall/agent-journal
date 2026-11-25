<?php

declare(strict_types=1);

namespace App\Commands\Agents\InstallMainAgent;

use App\Commands\Agents\CreateAgent\CreateAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
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
