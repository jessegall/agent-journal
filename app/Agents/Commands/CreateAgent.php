<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\CreateAgentHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Creates an agent with a name and the profile it starts with, and answers its actor; its owner, such as Helpers,
 * decides who it serves.
 *
 * @extends Command<ActorIdentity>
 */
#[HandledBy(CreateAgentHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
final readonly class CreateAgent extends Command implements HasAuthorizationSubject
{
    public function __construct(
        #[Required] public string $name,
        public string $profileKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
