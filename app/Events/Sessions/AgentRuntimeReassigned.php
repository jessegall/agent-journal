<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;
use App\Support\ActorIdentity;

/**
 * An operator moved a runtime to a new process generation: the audit record of the hosts, the proof that the old
 * process stopped, who did it and why.
 */
final readonly class AgentRuntimeReassigned implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
        public string $fromHostId,
        public string $toHostId,
        public int $processGeneration,
        public ActorIdentity $actor,
        public string $proof,
        public string $reason,
    ) {}
}
