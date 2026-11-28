<?php

declare(strict_types=1);

namespace App\Agents\Commands\CreateMainAgent;

use App\Agents\Commands\CreateAgent\CreateAgentCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStartChoice;
use App\Support\ActorReference;
use App\Values\ProfileBase;

/**
 * Creates the agent on the main-agent profile through Core's CreateAgentCommand, named Agent and the next number, and
 * keeps the chosen driver, model and account for its first start.
 */
final readonly class CreateMainAgentHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(CreateMainAgentCommand $command): ActorReference
    {
        $number = Agent::query()->count() + 1;

        $actor = $this->commands->run(new CreateAgentCommand(
            "Agent {$number}",
            ProfileBase::mainAgent()->key,
            $command->projectId,
        ));

        AgentStartChoice::create($actor->id, $command->driver, $command->model, $command->account);

        return $actor;
    }
}
