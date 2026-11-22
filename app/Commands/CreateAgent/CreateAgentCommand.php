<?php

declare(strict_types=1);

namespace App\Commands\CreateAgent;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentPolicy;
use App\Support\ActorIdentity;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Creates an agent with a name and the profile it starts with, and answers its actor; its owner, such as Helpers,
 * decides who it serves.
 *
 * @extends Command<ActorIdentity>
 */
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class CreateAgentCommand extends Command
{
    public function __construct(
        #[Required]
        public string $name,
        public string $profileKey,
    ) {}
}
