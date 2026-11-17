<?php

declare(strict_types=1);

namespace App\Core\Agents\Actions;

use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use App\Core\Agents\Support\LaunchedAgent;

/**
 * Gives a child agent its own journal session, credential and stack under its parent session, so a child's stop
 * never answers for its parent. A program's own child tool without an identity of its own stays turned off.
 */
final readonly class ProgramChildSessions
{
    public function __construct(private LaunchSessions $launches) {}

    public function open(AgentSession $parent, Agent $child, string $program): LaunchedAgent
    {
        return $this->launches->launch($child, $program, $parent);
    }
}
