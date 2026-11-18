<?php

declare(strict_types=1);

namespace App\Agents\Readers;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Exceptions\AssignmentDenied;

/**
 * Reads an agent's authority to give out work: a main agent that is not retired has it.
 */
final readonly class AgentAuthorityRecords implements AgentAuthority
{
    public function __construct(private AgentLifecycle $lifecycle) {}

    public function requireDispatcher(string $agentId): void
    {
        $caller = new ActorIdentity(ActorType::Agent, $agentId);

        try {
            $agent = $this->lifecycle->lockShared($agentId);
        } catch (AgentNotAvailable $retired) {
            throw AssignmentDenied::forCaller($caller, $retired);
        }

        if (! $agent->isMainAgent()) {
            throw AssignmentDenied::forCaller($caller);
        }
    }
}
