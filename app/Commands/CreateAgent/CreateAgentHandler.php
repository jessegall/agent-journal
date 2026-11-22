<?php

declare(strict_types=1);

namespace App\Commands\CreateAgent;

use App\Contracts\Actors\ActorProvisioning;
use App\Contracts\Bus\CommandHandler;
use App\Models\Agent;
use App\Support\ActorIdentity;

/**
 * Creates the agent inside the command's transaction, so a nested run from an owner's command joins that transaction.
 */
final readonly class CreateAgentHandler implements CommandHandler
{
    public function __construct(private ActorProvisioning $desks) {}

    public function handle(CreateAgentCommand $command): ActorIdentity
    {
        $agent = Agent::create($command->name, $command->profileKey);
        $actor = ActorIdentity::of($agent);
        $this->desks->provision($actor, $agent->name);

        return $actor;
    }
}
