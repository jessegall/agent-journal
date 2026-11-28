<?php

declare(strict_types=1);

namespace App\Support;

use App\Agents\Data\DriverRequestStatus;
use App\Agents\Enums\SessionProcessStatus;
use App\Sessions\Enums\SessionStatus;
use App\Sessions\Enums\StartDisposition;
use App\Sessions\Enums\StartReadiness;
use App\Sessions\SessionStartOutcome;

/**
 * Every fact the server holds of one agent that its status is decided from: retirement, the live session, its
 * supervised start and runtime, the latest switch, the runtime's latest request and the latest start outcome the
 * viewer has not dismissed. A fact the server does not hold is null, never guessed.
 */
final readonly class AgentEvidence
{
    public function __construct(
        public bool $isRetired,
        public string|null $sessionId,
        public SessionStatus|null $sessionStatus,
        public SessionProcessStatus|null $sessionProcess,
        public RuntimeEvidence|null $runtime,
        public bool $expectsRuntime,
        public SwitchEvidence|null $switch,
        public DriverRequestStatus|null $request,
        public SessionStartOutcome|null $start,
        public bool $canCancelStart,
        public bool $hasTerminal = false,
        public bool $canStop = false,
        public bool $waitsOnHelpers = false,
        public bool $canReconcile = false,
        // The readiness of the live session's latest start; none for a session that began from no start record.
        public StartReadiness|null $readiness = null,
        public bool $waitsForDriverImage = false,
    ) {}

    public function hasLiveSession(): bool
    {
        return $this->sessionId !== null;
    }

    /**
     * Whether the viewer has not dismissed the refusal of the agent's latest start.
     */
    public function isStartRefusalShown(): bool
    {
        return $this->start?->disposition === StartDisposition::Refused;
    }
}
