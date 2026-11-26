<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\Enums\AccessType;
use App\Models\Agents\Agent;
use App\Policies\AgentMaintenancePolicy;
use App\Stacks\Contracts\Work\UserStack as UserStackContract;
use App\Stacks\References\StateReference;
use App\Values\StackTarget;

/**
 * Pushes a state onto a running agent's stack for the user of this request, such as a message they want answered. The
 * agent stays the target, its frames stay, and the change runs in the caller's stack transaction under the stack's row
 * lock.
 */
final readonly class UserStack implements UserStackContract
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private AddressedStackPush $addressed,
    ) {}

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->authorizer->authorize(AgentMaintenancePolicy::class, Agent::class, AccessType::Edit);
        $this->addressed->push($target, $state);
    }
}
