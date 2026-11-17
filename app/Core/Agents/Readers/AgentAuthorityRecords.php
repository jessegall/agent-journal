<?php

declare(strict_types=1);

namespace App\Core\Agents\Readers;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Contracts\AgentAuthority;
use App\Core\Agents\Exceptions\AgentNotAvailable;
use App\Core\Agents\Lifecycle\AgentLifecycle;
use App\Core\Assignments\Exceptions\AssignmentDenied;

/**
 * Reads an agent's authority to give out work: a main agent that is not retired has it.
 */
final readonly class AgentAuthorityRecords implements AgentAuthority
{
    public function __construct(private AgentLifecycle $lifecycle) {}

    public function requireDispatcher(int $agentId): void
    {
        $caller = new ActorIdentity(ActorKind::Agent, $agentId);

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
