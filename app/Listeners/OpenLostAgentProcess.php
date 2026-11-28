<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostProcessLost;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;

/**
 * What its host lost of an agent is continued, as its driver decides once a restart of the host ended what it held: a
 * journal terminal opens again for the same start, a lost turn is followed by the next one for the work that waits,
 * and a host-run driver continues nothing of its own.
 */
final readonly class OpenLostAgentProcess implements Listener
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function handle(HostProcessLost $fact): void
    {
        $process = HostProcess::query()->whereKey($fact->processId)->sole();

        if ($process->agent_runtime_id === null) {
            return;
        }

        $runtime = AgentRuntime::query()->whereKey($process->agent_runtime_id)->sole();
        $this->drivers->forRuntime($runtime)->continueAgent($runtime);
    }
}
