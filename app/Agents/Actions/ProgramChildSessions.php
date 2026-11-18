<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\SelectedProgram;

/**
 * Gives a child agent its own journal session, credential and stack under its parent session, so a child's stop
 * never answers for its parent. Only the journal's helpers and workers get child sessions: a program's own native
 * child is never started (rule 36).
 */
final readonly class ProgramChildSessions
{
    public function __construct(private LaunchSessions $launches) {}

    public function open(AgentSession $parent, Agent $child, SelectedProgram $selection, string $requestId): LaunchedAgent
    {
        return $this->launches->launch($child, $selection, $requestId, $parent);
    }
}
