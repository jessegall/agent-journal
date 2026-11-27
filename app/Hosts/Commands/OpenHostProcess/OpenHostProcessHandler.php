<?php

declare(strict_types=1);

namespace App\Hosts\Commands\OpenHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostInstructionPlacement;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;

/**
 * Makes the process and its open instruction on a host that speaks protocol 1 and is not revoked.
 */
final readonly class OpenHostProcessHandler implements CommandHandler
{
    public function __construct(private HostInstructionPlacement $placement) {}

    public function handle(OpenHostProcessCommand $command): string
    {
        $host = $this->placement->orderingHost($command->hostId);
        $runtime = $command->runtimeId === null ? null : AgentRuntime::query()->whereKey($command->runtimeId)->sole();

        $start = null;
        $plan = $command->plan;

        // Every process of a start runs under its session's fence, which the session's stop conditions close.
        if ($command->sessionProcessId !== null) {
            $start = SessionProcess::findLockedById($command->sessionProcessId);
            $plan = $plan->withFence($start->session_id);
        }

        $process = HostProcess::create($host, $runtime, $plan, $start);
        $this->placement->forOpening($process, $plan, $command->source);

        return $process->getKey();
    }
}
