<?php

declare(strict_types=1);

namespace App\Agents\Commands\CreateAgent;

use App\Actors\Contracts\ActorProvisioning;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\Agent;
use App\Models\Projects\Project;
use App\Support\ActorReference;

/**
 * Creates the agent inside the command's transaction, so a nested run from an owner's command joins that transaction.
 */
final readonly class CreateAgentHandler implements CommandHandler
{
    public function __construct(private ActorProvisioning $desks) {}

    public function handle(CreateAgentCommand $command): ActorReference
    {
        $project = Project::findForId($command->projectId);
        $agent = Agent::create($command->name, $command->profileKey, $project);
        $actor = ActorReference::of($agent);
        $this->desks->provision($actor, $agent->name);

        return $actor;
    }
}
