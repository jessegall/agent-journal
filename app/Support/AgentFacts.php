<?php

declare(strict_types=1);

namespace App\Support;

use App\Agents\Enums\SessionProcessStatus;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\DriverSwitch;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Enums\StartDisposition;
use App\Sessions\Enums\StartReadiness;
use App\Sessions\SessionStartOutcome;
use Carbon\CarbonImmutable;

/**
 * The rows Home read for one agent, each the latest of its kind: its live session, that session's runtime and
 * supervised start, the runtime's latest request, the agent's latest switch and its latest start outcome.
 */
final readonly class AgentFacts
{
    public function __construct(
        public AgentSession|null $session,
        public AgentRuntime|null $runtime,
        public SessionProcess|null $start,
        public DriverRequest|null $request,
        public DriverSwitch|null $switch,
        public SessionStartOutcome|null $startOutcome,
        public bool $waitsOnHelpers,
        public StartReadiness|null $readiness,
        public bool $waitsForDriverImage,
    ) {}

    /**
     * The facts as the evidence a status is decided from, read at this time. A start an owner made runs on its own
     * host and opens no runtime here, so only a main start is expected to have one; only an owner's start in
     * progress may be cancelled, and only an actor allowed to stop it may stop a live session.
     */
    public function evidence(bool $isRetired, bool $canStop, CarbonImmutable $now): AgentEvidence
    {
        $session = $this->session;
        $isOwnerStart = $session?->parent_session_id !== null;

        $startInProgress = $this->startOutcome?->disposition === StartDisposition::Accepted
            || in_array($this->start?->status, SessionProcessStatus::unresolved(), true);

        return new AgentEvidence(
            $isRetired,
            $session?->id,
            $session?->status,
            $this->start?->status,
            $this->runtime === null ? null : RuntimeEvidence::of($this->runtime, $now),
            $session !== null && ! $isOwnerStart,
            $this->switch === null ? null : SwitchEvidence::of($this->switch),
            $this->request?->status,
            $this->startOutcome,
            $session !== null && (($isOwnerStart && $startInProgress) || $this->readiness?->isUnverified() === true),
            $this->runtime?->hasScreen() === true,
            $canStop && $session !== null,
            $this->waitsOnHelpers,
            $canStop,
            $this->readiness,
            $this->waitsForDriverImage,
        );
    }
}
