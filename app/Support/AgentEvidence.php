<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\DriverRequestStatus;
use App\Enums\ProcessStartState;
use App\Enums\SessionStatus;
use App\Enums\StartDisposition;
use App\Enums\StartReadiness;

/**
 * Every fact the server holds of one agent that its status is decided from: retirement, the live session, its
 * supervised start and runtime, the latest switch, the runtime's latest request and the latest launch outcome the
 * viewer has not dismissed. A fact the server does not hold is null, never guessed.
 */
final readonly class AgentEvidence
{
    public function __construct(
        public bool $retired,
        public string|null $sessionId,
        public SessionStatus|null $sessionStatus,
        public ProcessStartState|null $processStart,
        public RuntimeEvidence|null $runtime,
        public bool $expectsRuntime,
        public SwitchEvidence|null $switch,
        public DriverRequestStatus|null $request,
        public LaunchOutcome|null $launch,
        public bool $resumable,
        public bool $canCancelLaunch,
        public bool $hasTerminal = false,
        public bool $canStop = false,
        public bool $waitsOnHelpers = false,
        public bool $canReconcile = false,
        // The readiness of the live session's latest start; none for a session that began from no start record.
        public StartReadiness|null $readiness = null,
    ) {}

    public function hasLiveSession(): bool
    {
        return $this->sessionId !== null;
    }

    /**
     * Whether the viewer has not dismissed the refusal of the agent's latest launch.
     */
    public function isLaunchRefusalShown(): bool
    {
        return $this->launch?->disposition === StartDisposition::Refused;
    }
}
