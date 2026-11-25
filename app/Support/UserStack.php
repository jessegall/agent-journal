<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Work\UserStack as UserStackContract;
use App\Enums\Agents\AccessType;
use App\Models\Agents\Agent;
use App\Policies\AgentMaintenancePolicy;
use App\Support\References\StateReference;
use App\Values\StackTarget;

/**
 * Pushes a state onto a running agent's stack for the user acting in this request, such as a message they want
 * answered. The agent stays the target: its own profile decides at each hook, its frames stay, and the change runs in
 * the
 * caller's stack transaction under the stack's row lock. An agent never reaches another agent's stack this way.
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
