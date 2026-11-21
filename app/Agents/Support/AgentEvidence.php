<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Data\DriverRequestStatus;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Enums\SessionStatus;
use App\Agents\Enums\StartDisposition;

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
    ) {}

    public function hasLiveSession(): bool
    {
        return $this->sessionId !== null;
    }

    /**
     * Whether the viewer has not dismissed the refusal of the agent's latest launch.
     */
    public function showsLaunchRefusal(): bool
    {
        return $this->launch?->disposition === StartDisposition::Refused;
    }
}
