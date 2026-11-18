<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\CreateAgent;
use App\Agents\Exceptions\AgentNameRequired;
use App\Agents\Models\Agent;
use App\Contracts\CommandHandler;

/**
 * Creates the agent inside the command's transaction, so a nested run from an owner's command joins that transaction.
 */
final readonly class CreateAgentHandler implements CommandHandler
{
    /**
     * @throws AgentNameRequired
     */
    public function handle(CreateAgent $command): string
    {
        if (trim($command->name) === '') {
            throw AgentNameRequired::forAgent();
        }

        return Agent::named($command->name, $command->role)->id;
    }
}
