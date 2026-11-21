<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\StopProcessRun;
use App\Processes\Enums\RunLogicalResult;
use App\Processes\Enums\RunResultSource;
use App\Processes\Exceptions\StopRefused;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ProcessAdministration;
use App\Processes\Support\RunOutcomes;

/**
 * Marks the run stopped with the reason and stale for its supervisor, which then starts no further part; the
 * attempt's logical result is Stopped, a deliberate stop the journal decided.
 */
final readonly class StopProcessRunHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration, private RunOutcomes $outcomes) {}

    /**
     * @throws StopRefused
     */
    public function handle(StopProcessRun $command): string
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->lockForUpdate()->sole();
        $actor = ActorIdentity::of($command->dispatchedBy());

        if (! $this->administration->isGrantedToCaller() && ! $run->isByActor($actor)) {
            throw StopRefused::notYours($run->id);
        }

        if ($run->lifecycle->isFinal()) {
            throw StopRefused::ended($run->id);
        }

        $run->markStale("stopped: {$command->reason}");
        $run->markStopped($command->reason);
        $this->outcomes->record($run, RunLogicalResult::Stopped, RunResultSource::Journal);

        return $run->id;
    }
}
