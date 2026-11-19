<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorContext;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\DriverHeartbeatSource;
use App\Agents\Support\RuntimeEvidence;
use App\Agents\Support\RuntimeExit;
use Illuminate\Container\Attributes\Bind;

/**
 * Receives a driver's authenticated liveness evidence for a session and turns it into the session's heartbeat or its
 * verified exit. The server's own clock dates both; no time the host sends is taken as truth.
 */
#[Bind(DriverHeartbeatSource::class)]
interface AgentHeartbeatSource
{
    /**
     * Refreshes the session's presence on behalf of the actor whose command reported the evidence.
     *
     * @throws HostReportRefused
     */
    public function record(AgentSession $session, RuntimeEvidence $evidence, ActorContext $actor): void;

    /**
     * @throws HostReportRefused
     */
    public function recordExit(AgentSession $session, RuntimeExit $exit): void;
}
