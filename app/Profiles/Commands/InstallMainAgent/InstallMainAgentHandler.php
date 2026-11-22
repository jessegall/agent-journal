<?php

declare(strict_types=1);

namespace App\Profiles\Commands\InstallMainAgent;

use App\Agents\Commands\CreateAgent\CreateAgentCommand;
use App\Agents\Models\Agent;
use App\Agents\Models\MainAgentDesignation;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Values\ProfileBase;

final readonly class InstallMainAgentHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(InstallMainAgentCommand $command): void
    {
        if (MainAgentDesignation::isDesignated()) {
            return;
        }

        $main = ProfileBase::mainAgent();
        $actor = $this->commands->run(new CreateAgentCommand($main->label, $main->key));
        MainAgentDesignation::create(Agent::query()->findOrFail($actor->id));
    }
}
