<?php

declare(strict_types=1);

namespace App\Agents\Commands\CreateAgent;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentPolicy;
use App\Projects\Contracts\ProjectCommand;
use App\Support\ActorReference;
use App\Support\Command;
use App\Values\ProjectOwner;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Creates an agent of a project with a name and the profile it starts with, and answers its actor; its owner, such as
 * Helpers, decides who it serves.
 *
 * @extends Command<ActorReference>
 */
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class CreateAgentCommand extends Command implements ProjectCommand
{
    public function __construct(
        #[Required]
        public string $name,
        public string $profileKey,
        public string $projectId,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
