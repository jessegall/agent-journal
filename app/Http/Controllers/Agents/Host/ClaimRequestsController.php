<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Support\ClaimedRequests;
use App\Agents\Support\DriverBudgets;
use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Reads\Support\ScopedReadMeter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Hands the host its next requests; when none waits it polls again for a short bounded time. The host's calls run as
 * the journal itself: a host is infrastructure, never an actor.
 */
final readonly class ClaimRequestsController
{
    public function __invoke(
        Request $request,
        HostContext $host,
        CommandBus $commands,
        DriverBudgets $budgets,
    ): JsonResponse {
        $limit = min($budgets->claimBatchMax, max(1, $request->integer('limit', 10)));
        $deadline = microtime(true) + min($budgets->longPollMaxSeconds, max(0, $request->integer('wait', 0)));

        $claim = fn (): ClaimedRequests => $commands->run(new ClaimDriverRequests($host->hostId, $limit));
        $claimed = ScopedReadMeter::ofCurrentScope()->withinSchedule(
            'host long poll',
            fn () => $this->pollUntil($deadline, $claim),
        );

        return new JsonResponse(['requests' => $claimed->requests]);
    }

    /**
     * Claims again every quarter second until something is claimed or the deadline passes: the same reads repeat on
     * purpose, as the poll's schedule.
     *
     * @param  callable(): ClaimedRequests  $claim
     */
    private function pollUntil(float $deadline, callable $claim): ClaimedRequests
    {
        do {
            $claimed = $claim();
            if (! $claimed->isEmpty() || microtime(true) >= $deadline) {
                return $claimed;
            }
            usleep(250_000);
        } while (true);
    }
}
