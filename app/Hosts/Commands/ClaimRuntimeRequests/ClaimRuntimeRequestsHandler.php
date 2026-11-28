<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ClaimRuntimeRequests;

use App\Agents\Drivers\Work\DriverRequestClaims;
use App\Bus\Contracts\CommandHandler;
use App\Hosts\ClaimedRequests;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;

/**
 * Hands the worker its runtime's pending requests, the way a host's claim hands out those of runtimes no worker
 * drives, and writes nothing on the host's row.
 */
final readonly class ClaimRuntimeRequestsHandler implements CommandHandler
{
    public function __construct(private DriverRequestClaims $claims) {}

    public function handle(ClaimRuntimeRequestsCommand $command): ClaimedRequests
    {
        $process = HostProcess::findLocked($command->processId);
        $process->assertWorker($command->workerGeneration);

        // A probe acts on no request, so it takes none: a stop or an interrupt it took would be lost to the process
        // that runs the runtime's turns.
        if ($process->purpose->isProbe()) {
            return new ClaimedRequests([]);
        }

        $runtimes = AgentRuntime::query()
            ->whereKey($process->agent_runtime_id)
            ->withSessionAgent()
            ->withAcceptedRequest()
            ->get()
            ->keyBy('id');

        if (! $process->purpose->isRuntimeProcess()) {
            return $this->claims->claimControlFor($runtimes);
        }

        return $this->claims->claimFor($runtimes, $command->limit);
    }
}
