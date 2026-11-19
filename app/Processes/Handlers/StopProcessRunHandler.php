<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\StopProcessRun;
use App\Processes\Exceptions\StopRefused;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ProcessAdministration;

/**
 * Marks the run stopped with the reason and stale for its supervisor, which then starts no further part.
 */
final readonly class StopProcessRunHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private ProcessAdministration $administration) {}

    /**
     * @throws StopRefused
     */
    public function handle(StopProcessRun $command): string
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->lockForUpdate()->sole();
        $actor = ActorIdentity::of($this->actors->actor());
        if (! $this->administration->isGrantedToCaller() && ! $run->isByActor($actor)) {
            throw StopRefused::notYours($run->id);
        }
        if ($run->lifecycle->isFinal()) {
            throw StopRefused::ended($run->id);
        }
        $run->markStale("stopped: {$command->reason}");
        $run->markStopped($command->reason);

        return $run->id;
    }
}
