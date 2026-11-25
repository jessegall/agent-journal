<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Attributes\Bus\Dispatches;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Projects\ClaimProjectReads\ClaimProjectReadsCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Projects\ArrangementType;
use App\Models\Projects\Host;
use App\Support\ClaimAnswer;
use App\Support\DriverBudgets;
use App\Support\HostClaim;
use App\Support\ReadMeter;
use App\Support\WatchedRuntimes;
use App\Values\BrowserInputCapabilities;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Hands the host its next requests and the runtimes watched on it; when none waits and the watched list is the one
 * the host knows, it polls again for a short bounded time. A host reports where it runs agents with each claim, local
 * when it says nothing, and one that differs from its enrolment is refused. The host's calls run as the journal itself:
 * a host is infrastructure, never an actor.
 */
final readonly class ClaimRequestsController
{
    #[Dispatches(ClaimDriverRequestsCommand::class)]
    #[Dispatches(ClaimProjectReadsCommand::class)]
    public function __invoke(
        Request $request,
        HostContext $host,
        CommandBus $commands,
        DriverBudgets $budgets,
        WatchedRuntimes $watched,
    ): JsonResponse {
        $request->validate([
            'watched_version' => ['required', 'integer', 'min:0'],
            'arrangement' => ['sometimes', Rule::enum(ArrangementType::class)],
            'browser_input' => ['sometimes', 'boolean'],
            'browser_keys' => ['sometimes', 'boolean'],
            'browser_paste' => ['sometimes', 'boolean'],
            'browser_resize' => ['sometimes', 'boolean'],
            'browser_private' => ['sometimes', 'boolean'],
        ]);

        Host::query()->whereKey($host->hostId)->sole()->assertEnrolledAs(
            $request->enum('arrangement', ArrangementType::class) ?? ArrangementType::Local,
        );

        $limit = min($budgets->claimBatchMax, max(1, $request->integer('limit', 10)));
        $deadline = microtime(true) + min($budgets->longPollMaxSeconds, max(0, $request->integer('wait', 0)));
        $knownVersion = $request->integer('watched_version');

        $browserInput = new BrowserInputCapabilities(
            $request->boolean('browser_input'),
            $request->boolean('browser_keys'),
            $request->boolean('browser_paste'),
            $request->boolean('browser_resize'),
            $request->boolean('browser_private'),
        );

        $claiming = new ClaimDriverRequestsCommand($host->hostId, $limit, $browserInput);
        $reading = new ClaimProjectReadsCommand($host->hostId);
        $claim = fn () => new HostClaim($commands->run($claiming), $commands->run($reading));
        $version = fn () => $watched->version($host->hostId);

        $claimed = ReadMeter::ofCurrentScope()->withinSchedule(
            'host long poll',
            fn () => $this->pollUntil($deadline, $claim, $version, $knownVersion),
        );

        $watchedTerminals = $watched->forHost($host->hostId);

        return new JsonResponse(new ClaimAnswer($claimed, $watchedTerminals));
    }

    /**
     * Claims again every quarter second until a driver request or a read of the host's projects is claimed, the
     * watched list's version is not the one the host knows, or the deadline passes: a read a user waits on is handed
     * out within a tick. The same reads repeat on purpose, as the poll's schedule.
     *
     * @param  callable(): HostClaim  $claim
     * @param  callable(): int  $version
     */
    private function pollUntil(float $deadline, callable $claim, callable $version, int $knownVersion): HostClaim
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
