<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Work\HeadlessStarts;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostProcessLost;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;

/**
 * A terminal the journal drives that its host lost, as a restart of the host ends the terminals it held, is opened
 * again; the host resumes its conversation once the driver's restart file exists.
 */
final readonly class OpenLostTerminalAgain implements Listener
{
    public function __construct(private HeadlessStarts $starts) {}

    public function handle(HostProcessLost $fact): void
    {
        $process = HostProcess::query()->whereKey($fact->processId)->sole();

        if ($this->starts->opensAgainWhenLost($process)) {
            $this->starts->openProven(AgentRuntime::query()->whereKey($process->agent_runtime_id)->sole());
        }
    }
}
