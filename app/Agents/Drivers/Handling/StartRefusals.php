<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Handling;

use App\Hosts\Contracts\HostProcessEndEvent;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;

/**
 * A start's process that ended before it ever ran refuses that start with why, whichever driver ran it, while the start
 * is still unproven.
 */
final readonly class StartRefusals
{
    /**
     * Refuses the process's start when the process never ran, and answers whether it did.
     */
    public function refuseUnstarted(HostProcess $process, HostProcessEndEvent $fact): bool
    {
        if ($process->session_process_id === null || $process->started_at !== null) {
            return false;
        }

        // A probe judged before it was lost, as after a host restart, leaves the start it proved alone.
        if ($process->agent_runtime_id !== null && AgentRuntime::query()->findOrFail($process->agent_runtime_id)->hasProvenStart()) {
            return false;
        }

        SessionProcess::findLockedById($process->session_process_id)->refuse($fact->evidence);

        return true;
    }
}
