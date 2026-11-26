<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Access\Contracts\AgentAuthority as AgentAuthorityContract;
use App\Access\Contracts\TargetAuthorizer;
use App\Agents\Enums\AccessType;
use App\Exceptions\AssignmentDenied;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Policies\AssignmentRecipientPolicy;
use App\Sessions\Exceptions\AgentNotAvailable;
use App\Support\ActorReference;
use App\Support\Lifecycle\AgentLifecycle;

/**
 * Reads an agent's authority to give out work: a main agent that is not retired has it.
 */
final readonly class AgentAuthority implements AgentAuthorityContract
{
    public function __construct(private AgentLifecycle $lifecycle, private TargetAuthorizer $authorizer) {}

    public function requireDispatcher(string $agentId): void
    {
        $caller = ActorReference::ofClass(Agent::class, $agentId);

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
