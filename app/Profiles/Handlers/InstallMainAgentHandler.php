<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Agents\Commands\CreateAgent;
use App\Agents\Models\Agent;
use App\Agents\Models\MainAgentDesignation;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\InstallMainAgent;
use App\Profiles\Values\ProfileBase;

final readonly class InstallMainAgentHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(InstallMainAgent $command): void
    {
        if (MainAgentDesignation::isDesignated()) {
            return;
        }

        $main = ProfileBase::mainAgent();
        $actor = $this->commands->run(new CreateAgent($main->label, $main->key));
        MainAgentDesignation::create(Agent::query()->findOrFail($actor->id));
    }
}
