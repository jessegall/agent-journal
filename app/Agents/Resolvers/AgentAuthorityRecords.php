<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\TargetAuthorizer;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentRecipientPolicy;
use App\Operations\Enums\AccessType;

/**
 * Reads an agent's authority to give out work: a main agent that is not retired has it.
 */
final readonly class AgentAuthorityRecords implements AgentAuthority
{
    public function __construct(private AgentLifecycle $lifecycle, private TargetAuthorizer $authorizer) {}

    public function requireDispatcher(string $agentId): void
    {
        $caller = new ActorIdentity(ActorType::Agent, $agentId);

        try {
            $this->lifecycle->lockShared($agentId);
        } catch (AgentNotAvailable $retired) {
            throw AssignmentDenied::forCaller($caller, $retired);
        }

        $dispatch = [AccessType::Delegate];

        if ($this->authorizer->filterActions(
            $caller,
            AssignmentRecipientPolicy::class,
            AssignmentRecord::class,
            $dispatch,
        ) === []) {
            throw AssignmentDenied::forCaller($caller);
        }
    }
}
