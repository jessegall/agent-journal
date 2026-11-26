<?php

declare(strict_types=1);

namespace App\Commands\Hosts\OpenHostProcess;

use App\Contracts\Bus\CommandHandler;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Support\Hosts\HostOrderPlacement;

/**
 * Makes the process and its open order on a host that speaks protocol 1 and is not revoked.
 */
final readonly class OpenHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(OpenHostProcessCommand $command): string
    {
        $host = $this->placement->orderingHost($command->hostId);
        $runtime = $command->runtimeId === null ? null : AgentRuntime::query()->whereKey($command->runtimeId)->sole();

        $start = $command->sessionProcessId === null
            ? null
            : SessionProcess::findLockedById($command->sessionProcessId);

        $process = HostProcess::create($host, $runtime, $command->plan, $start);
        $this->placement->forOpening($process, $command->plan, $command->source);

        return $process->id;
    }
}
