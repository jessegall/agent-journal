<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;

/**
 * An ended host process of a start ends what it ran for as the runtime's driver decides: refused, stopped or left to
 * go on.
 */
#[InCommandTransaction]
final readonly class EndStartWithItsProcess implements Listener
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        $process = HostProcess::query()->whereKey($fact->processId)->sole();

        if ($process->session_process_id === null || $process->agent_runtime_id === null) {
            return;
        }

        $runtime = AgentRuntime::query()->whereKey($process->agent_runtime_id)->sole();
        $this->drivers->forRuntime($runtime)->endWith($process, $fact);
    }
}
