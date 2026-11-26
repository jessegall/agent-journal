<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Commands\Hosts\ClaimHostWorker\ClaimHostWorkerCommand;
use App\Commands\Hosts\ClaimRuntimeRequests\ClaimRuntimeRequestsCommand;
use App\Commands\Hosts\RenewHostWorker\RenewHostWorkerCommand;
use App\Commands\Hosts\StreamHostProcess\StreamHostProcessCommand;
use App\Commands\Hosts\TakeHostProcessSnapshot\TakeHostProcessSnapshotCommand;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Time\MonotonicClock;
use App\Contracts\Time\ServerClock;
use App\Enums\Hosts\HostProcessType;
use App\Exceptions\WorkerFenced;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Support\Command;
use App\Support\CommandRegistry;
use App\Support\Hosts\HostWake;
use App\Support\Hosts\ProcessFeed;
use App\Support\Hosts\StreamRate;
use App\Values\DriverActions;
use App\Values\FeedEntry;
use App\Values\HostOrderSource;

/**
 * Runs the worker of one process: it takes the process over, goes on where the worker before it stopped, and then
 * hands its process driver each output, request and order answer as it arrives, until it is fenced, asked to
 * restart or the process ends. Nothing polls: a step waits on the process's feed and its runtime's wakes.
 */
final readonly class DriverWorkers
{
    /**
     * How often a worker renews its ten-second lease.
     */
    public const int RENEW_MS = 3000;

    /**
     * The most requests a worker takes in one claim.
     */
    public const int REQUEST_LIMIT = 10;

    private const string ENTRY = 'driver worker';

    public function __construct(
        private ProcessFeed $feed,
        private ProcessDrivers $drivers,
        private JournalCommands $commands,
        private ServerClock $clock,
        private MonotonicClock $monotonic,
        private DriverRestartSignal $restart,
        private CommandRegistry $registry,
        private WorkerLease $lease,
    ) {}

    /**
     * Takes the process over and starts its driver where the requests stand.
     */
    public function begin(string $processId): DriverWork
    {
        $generation = $this->run(new ClaimHostWorkerCommand($processId));
        $process = HostProcess::query()->with('runtime')->whereKey($processId)->sole();
        $output = ProcessFeed::streamKey($process->id);
        $streams = [$output];

        if ($process->agent_runtime_id !== null) {
            $streams[] = HostWake::runtimeKey($process->agent_runtime_id);
        }

        $cursors = array_combine($streams, array_map($this->feed->lastCursor(...), $streams));

        // The process's first worker reads all it printed, as a short process may print before a worker begins.
        if ($generation === 1) {
            $cursors[$output] = ProcessFeed::FIRST_CURSOR;
        }

        // A process that ended before this worker began has its end before the cursor: it is told again after it.
        if (! $process->isLive()) {
            $this->feed->markEnded($process->id);
        }

        $driver = $this->drivers->for($process, $generation);
        $now = $this->clock->now();
        $work = new DriverWork($process->id, $generation, $driver, $now, $cursors, $this->monotonic->nanoseconds());

        $this->perform($work, $this->resumed($work, $process)->then($this->requestsOf($work)));

        if ($process->type === HostProcessType::Terminal) {
            $source = HostOrderSource::forWorker($generation);

            $this->perform($work, DriverActions::of(
                new TakeHostProcessSnapshotCommand($process->id, $source),
                new StreamHostProcessCommand($process->id, StreamRate::of(true, 0), false, $source),
            ));
        }

        return $work;
    }

    /**
     * Waits up to the milliseconds for what the process sends and hands it to the driver; answers whether the worker
     * goes on.
     */
    public function step(DriverWork $work, int $waitMs): bool
    {
        try {
            return $this->carryOn($work, $waitMs);
        } catch (WorkerFenced) {
            return false;
        }
    }

    private function carryOn(DriverWork $work, int $waitMs): bool
    {
        if ($this->restart->isAskedSince($work->startedAt)) {
            return false;
        }

        foreach ($this->feed->read($work->cursors(), $waitMs) as $entry) {
            $work->advance($entry->stream, $entry->cursor);

            if ($entry->hasEnded) {
                $this->perform($work, $work->driver->onExit());

                return false;
            }

            $this->perform($work, $this->handOver($work, $entry));
        }

        $now = $this->monotonic->nanoseconds();

        if ($work->isLeaseDue($now)) {
            $this->perform($work, DriverActions::of(new RenewHostWorkerCommand($work->processId, $work->generation)));
            $work->renew($now);
        }

        return true;
    }

    private function handOver(DriverWork $work, FeedEntry $entry): DriverActions
    {
        if ($entry->answeredOrderId !== null) {
            $answered = HostOrder::query()->whereKey($entry->answeredOrderId)->sole();

            return $work->driver->onAnswer($answered);
        }

        if ($entry->isWake()) {
            return $this->requestsOf($work);
        }

        return $work->driver->onOutput($entry);
    }

    private function resumed(DriverWork $work, HostProcess $process): DriverActions
    {
        if ($process->runtime === null) {
            return $work->driver->resume([], []);
        }

        $inFlight = array_values(DriverRequest::query()->inFlightFor($process->runtime)->get()->all());
        $ordered = array_merge(...array_map(fn (DriverRequest $request) => HostOrder::orderedFor($request), $inFlight));

        return $work->driver->resume($inFlight, $ordered);
    }

    private function requestsOf(DriverWork $work): DriverActions
    {
        $claim = new ClaimRuntimeRequestsCommand($work->processId, $work->generation, self::REQUEST_LIMIT);
        $claimed = $this->lease->hold($work->processId, $work->generation, fn () => $this->run($claim));
        $actions = DriverActions::none();

        foreach ($claimed->requests as $request) {
            $actions = $actions->then($work->driver->onRequest($request));
        }

        return $actions;
    }

    /**
     * Runs the commands as the worker: each is refused once another worker took the process over.
     */
    private function perform(DriverWork $work, DriverActions $actions): void
    {
        $answered = DriverActions::none();

        $this->lease->hold($work->processId, $work->generation, function () use ($actions, $work, &$answered): void {
            foreach ($actions->commands as $command) {
                $answered = $answered->then($work->driver->onAnswered($command, $this->run($command)));
            }
        });

        if ($answered->commands !== []) {
            $this->perform($work, $answered);
        }
    }

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function run(Command $command): mixed
    {
        return $this->commands->runAsJournal($this->registry->entryOf($command::class), self::ENTRY, $command);
    }
}
