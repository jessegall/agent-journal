<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ClaimRuntimeRequests;

use App\Contracts\Bus\CommandHandler;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Support\ClaimedRequests;
use App\Support\Drivers\DriverRequestClaims;

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

        $runtimes = AgentRuntime::query()
            ->withSessionAgent()
            ->whereKey($process->agent_runtime_id)
            ->withAcceptedRequest()
            ->get()
            ->keyBy('id');

        return $this->claims->claimFor($runtimes, $command->limit);
    }
}
