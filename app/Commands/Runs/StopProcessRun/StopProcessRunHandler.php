<?php

declare(strict_types=1);

namespace App\Commands\Runs\StopProcessRun;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Runs\RunLogicalResult;
use App\Enums\Runs\RunResultSource;
use App\Exceptions\StopRefused;
use App\Models\Runs\ProcessRun;
use App\Support\ActorReference;
use App\Support\ProcessAdministration;
use App\Support\RunOutcomes;

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
    public function handle(StopProcessRunCommand $command): string
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->lockForUpdate()->sole();
        $actor = ActorReference::of($command->dispatchedBy());

        if (! $this->administration->isGrantedToCaller() && ! $run->isByActor($actor)) {
            throw StopRefused::ofAnotherActor($run->id);
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
