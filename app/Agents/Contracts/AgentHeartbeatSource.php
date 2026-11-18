<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

/**
 * An agent driver sends authenticated beats of one session to POST /agent/heartbeat at least once a minute while it has
 * current liveness evidence, stops when that evidence ends, and reports a verified exit separately through
 * LaunchHeartbeats::markExited. The driver design adds the methods and the transport.
 */
interface AgentHeartbeatSource {}
