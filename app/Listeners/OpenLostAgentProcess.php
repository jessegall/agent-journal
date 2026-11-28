<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Work\HeadlessStarts;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostProcessLost;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;

/**
 * What its host lost of an agent the journal drives is opened again, as a restart of the host ends what it held: a
 * terminal goes on for the same start, the host resuming its conversation once the driver's restart file exists, and
 * a lost headless turn is followed by the next one, so work that arrived while the turn still looked live is taken.
 */
final readonly class OpenLostAgentProcess implements Listener
{
    public function __construct(private HeadlessStarts $starts) {}

    public function handle(HostProcessLost $fact): void
    {
        $process = HostProcess::query()->whereKey($fact->processId)->sole();

        if ($this->starts->opensAgainWhenLost($process)) {
            $this->starts->openProven(AgentRuntime::query()->whereKey($process->agent_runtime_id)->sole());

            return;
        }

        if ($process->purpose === HostProcessPurpose::AgentTurn && $process->agent_runtime_id !== null) {
            $this->starts->openNextTurn(AgentRuntime::query()->whereKey($process->agent_runtime_id)->sole());
        }
    }
}
