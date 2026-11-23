<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Authorization\AgentAuthority;
use App\Contracts\Authorization\TargetAuthorizer;
use App\Enums\AccessType;
use App\Enums\ActorType;
use App\Exceptions\AgentNotAvailable;
use App\Exceptions\AssignmentDenied;
use App\Models\Records\AssignmentRecord;
use App\Policies\AssignmentRecipientPolicy;
use App\Support\ActorIdentity;
use App\Support\Lifecycle\AgentLifecycle;

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
