<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ProcessStartState;
use App\Enums\StartDisposition;
use App\Enums\StartReadiness;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\DriverSwitch;
use App\Models\Starts\ProcessStart;
use Carbon\CarbonImmutable;

/**
 * The rows Home read for one agent, each the latest of its kind: its live session, that session's runtime and
 * supervised start, the runtime's latest request, the agent's latest switch and its latest launch outcome.
 */
final readonly class AgentFacts
{
    public function __construct(
        public AgentSession|null $session,
        public AgentRuntime|null $runtime,
        public ProcessStart|null $start,
        public DriverRequest|null $request,
        public DriverSwitch|null $switch,
        public LaunchOutcome|null $launch,
        public bool $waitsOnHelpers,
        public StartReadiness|null $readiness,
    ) {}

    /**
     * The facts as the evidence a status is decided from, read at this time. A start an owner made runs on its own
     * host and opens no runtime here, so only a main start is expected to have one; only an owner's start in
     * progress may be cancelled, and only an actor allowed to stop it may stop a live session.
     */
    public function evidence(bool $isRetired, bool $isResumable, bool $canStop, CarbonImmutable $now): AgentEvidence
    {
        $session = $this->session;
        $isOwnerStart = $session?->parent_session_id !== null;

        $launchInProgress = $this->launch?->disposition === StartDisposition::Accepted
            || in_array($this->start?->state, ProcessStartState::unresolved(), true);

        return new AgentEvidence(
            $isRetired,
            $session?->id,
            $session?->status,
            $this->start?->state,
            $this->runtime === null ? null : RuntimeEvidence::of($this->runtime, $now),
            $session !== null && ! $isOwnerStart,
            $this->switch === null ? null : SwitchEvidence::of($this->switch),
            $this->request?->status,
            $this->launch,
            $isResumable,
            $session !== null && (($isOwnerStart && $launchInProgress) || $this->readiness?->isUnverified() === true),
            $this->runtime?->hasScreen() === true,
            $canStop && $session !== null,
            $this->waitsOnHelpers,
            $canStop,
            $this->readiness,
        );
    }
}
