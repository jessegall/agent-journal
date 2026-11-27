<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Work;

use App\Hosts\HostWake;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;

/**
 * The workers that take a runtime's requests up: its own process's, and the account owner's when the owner runs its
 * turns. Waking them makes each claim what is waiting.
 */
final readonly class RuntimeWorkers
{
    public function __construct(private HostWake $wake, private AccountOwners $owners) {}

    public function wake(AgentRuntime $runtime): void
    {
        $this->wake->wakeRuntime($runtime->id);
        $start = SessionProcess::findCurrentOf($runtime->agent_session_id);

        if ($start !== null && $this->owners->serves($runtime)) {
            $this->wake->wakeAccount($start);
        }
    }
}
