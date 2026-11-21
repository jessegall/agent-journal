<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Values\StackTarget;
use App\Hooks\Contracts\UserStack;
use App\Hooks\References\StateReference;
use App\Operations\Enums\AccessType;

/**
 * Pushes a state onto a running agent's stack for the user acting in this request, such as a message they want
 * answered. The agent stays the target: its own profile decides at each hook, its frames stay, and the change runs in
 * the
 * caller's stack transaction under the stack's row lock. An agent never reaches another agent's stack this way.
 */
final readonly class UserStacks implements UserStack
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
