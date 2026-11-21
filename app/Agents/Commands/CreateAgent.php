<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Support\ActorIdentity;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Creates an agent with a name and the profile it starts with, and answers its actor; its owner, such as Helpers,
 * decides who it serves.
 *
 * @extends Command<ActorIdentity>
 */
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class CreateAgent extends Command
{
    public function __construct(
        #[Required]
        public string $name,
        public string $profileKey,
    ) {}
}
