<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Hosts\Contracts\HostProcessEndEvent;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;

/**
 * How a driver's runtimes are run: what opens a start, what carries the agent on once its start is proven, and what
 * the end of one of its processes means for the start. The application asks this and never which kind of driver runs.
 */
interface RuntimeHandling
{
    /**
     * Opens the runtime's registered start, or leaves it for its host to claim.
     */
    public function openStart(AgentRuntime $runtime): void;

    /**
     * Opens what the runtime runs next once its start is proven: its terminal, its next turn, or nothing of its own.
     */
    public function continueAgent(AgentRuntime $runtime): void;

    /**
     * What the ended process means for the start it ran for: refused, stopped or left to go on.
     */
    public function endWith(HostProcess $process, HostProcessEndEvent $fact): void;

    /**
     * Whether the journal itself opens the runtime's processes, rather than its host.
     */
    public function isRunByJournal(): bool;

    /**
     * Whether any activity of the woken agent settles its wake, rather than the end of the turn the wake opened.
     */
    public function isWakeSettledByActivity(): bool;

    /**
     * Whether the end of the runtime's own process ends the runtime, rather than leaving it to its driver to go on.
     */
    public function isRuntimeEndedBy(HostProcessEndEvent $fact): bool;
}
