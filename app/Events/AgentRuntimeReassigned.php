<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Support\ActorIdentity;

/**
 * An operator moved a runtime to a new process generation: the audit record of the hosts, the proof that the old
 * process stopped, who did it and why.
 */
final readonly class AgentRuntimeReassigned implements Event
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
