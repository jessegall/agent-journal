<?php

declare(strict_types=1);

namespace App\Agents\Commands\CreateMainAgent;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentPolicy;
use App\Projects\Contracts\ProjectCommand;
use App\Support\ActorReference;
use App\Support\Command;
use App\Values\ChosenAccount;
use App\Values\ProjectOwner;

/**
 * A user opens a new chat: another main agent of the project, named by its number, whose first message starts it on
 * the driver, model and account chosen here; the answer is its actor. Any number of main agents may run.
 *
 * @extends Command<ActorReference>
 */
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class CreateMainAgentCommand extends Command implements ProjectCommand
{
    public function __construct(
        public string $projectId,
        public string $driver,
        public string $model,
        public ChosenAccount|null $account,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
