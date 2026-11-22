<?php

declare(strict_types=1);

namespace App\Commands\InstallMainAgent;

use App\Commands\CreateAgent\CreateAgentCommand;
use App\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Models\Agent;
use App\Models\MainAgentDesignation;
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
        $actor = $this->commands->run(new CreateAgentCommand($main->label, $main->key));
        MainAgentDesignation::create(Agent::query()->findOrFail($actor->id));
    }
}
