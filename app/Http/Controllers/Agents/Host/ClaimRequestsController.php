<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Support\ClaimAnswer;
use App\Agents\Support\ClaimedRequests;
use App\Agents\Support\DriverBudgets;
use App\Agents\Support\HostContext;
use App\Agents\Support\WatchedRuntimes;
use App\Bus\Contracts\CommandBus;
use App\Reads\Support\ScopedReadMeter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Hands the host its next requests and the runtimes watched on it; when none waits and the watched list is the one
 * the host knows, it polls again for a short bounded time. The host's calls run as the journal itself: a host is
 * infrastructure, never an actor.
 */
final readonly class ClaimRequestsController
{
    public function __invoke(
        Request $request,
        HostContext $host,
        CommandBus $commands,
        DriverBudgets $budgets,
        WatchedRuntimes $watched,
    ): JsonResponse {
        $request->validate(['watched_version' => ['required', 'integer', 'min:0']]);
        $limit = min($budgets->claimBatchMax, max(1, $request->integer('limit', 10)));
        $deadline = microtime(true) + min($budgets->longPollMaxSeconds, max(0, $request->integer('wait', 0)));
        $knownVersion = $request->integer('watched_version');

        $claim = fn (): ClaimedRequests => $commands->run(new ClaimDriverRequests($host->hostId, $limit));
        $version = fn (): int => $watched->version($host->hostId);
        $claimed = ScopedReadMeter::ofCurrentScope()->withinSchedule(
            'host long poll',
            fn () => $this->pollUntil($deadline, $claim, $version, $knownVersion),
        );
        $watchedTerminals = $watched->forHost($host->hostId);

        return new JsonResponse(new ClaimAnswer($claimed, $watchedTerminals));
    }

    /**
     * Claims again every quarter second until something is claimed, the watched list's version is not the one the
     * host knows, or the deadline passes: the same reads repeat on purpose, as the poll's schedule.
     *
     * @param  callable(): ClaimedRequests  $claim
     * @param  callable(): int  $version
     */
    private function pollUntil(float $deadline, callable $claim, callable $version, int $knownVersion): ClaimedRequests
    {
        do {
            $claimed = $claim();

            if (! $claimed->isEmpty() || $version() !== $knownVersion || microtime(true) >= $deadline) {
                return $claimed;
            }
            usleep(250_000);
        } while (true);
    }
}
