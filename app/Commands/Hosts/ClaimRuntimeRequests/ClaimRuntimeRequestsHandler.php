<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ClaimRuntimeRequests;

use App\Agents\Drivers\Work\AccountOwners;
use App\Agents\Drivers\Work\DriverRequestClaims;
use App\Contracts\Bus\CommandHandler;
use App\Models\Hosts\HostProcess;
use App\Support\ClaimedRequests;

/**
 * Hands the worker its runtime's pending requests, the way a host's claim hands out those of runtimes no worker
 * drives, and writes nothing on the host's row.
 */
final readonly class ClaimRuntimeRequestsHandler implements CommandHandler
{
    public function __construct(private DriverRequestClaims $claims, private AccountOwners $owners) {}

    public function handle(ClaimRuntimeRequestsCommand $command): ClaimedRequests
    {
        $process = HostProcess::findLocked($command->processId);
        $process->assertWorker($command->workerGeneration);

        $runtimes = $this->owners->runtimesOf($process)
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
