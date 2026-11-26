<?php

declare(strict_types=1);

namespace App\Commands\Drivers\ClaimDriverRequests;

use App\Contracts\Bus\CommandHandler;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
use App\Support\ClaimedRequests;
use App\Support\Drivers\DriverRequestClaims;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Hands a host the pending requests of its runtimes that no worker drives; a worker claims its runtime's own.
 */
final readonly class ClaimDriverRequestsHandler implements CommandHandler
{
    public function __construct(private DriverRequestClaims $claims) {}

    public function handle(ClaimDriverRequestsCommand $command): ClaimedRequests
    {
        Host::query()->whereKey($command->hostId)->sole()->advertiseBrowserInput($command->browserInput);

        /**
         * @var Collection<string, AgentRuntime> $runtimes
         */
        // Only the runtimes with a request waiting: a host keeps the runtime of every session it ever ran.
        $runtimes = AgentRuntime::query()
            ->withSessionAgent()
            ->onHost($command->hostId)
            ->withAcceptedRequest()
            ->withoutDrivingWorker(CarbonImmutable::now())
            ->readAll('every runtime of one host with a request waiting is offered its work')
            ->get()
            ->keyBy('id');

        return $this->claims->claimFor($runtimes, $command->limit);
    }
}
