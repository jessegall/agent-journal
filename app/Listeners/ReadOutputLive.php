<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Processes\OutputChunkCommitted;
use App\Models\Runs\PartRun;
use App\Processes\Commands\ReadPartLive\ReadPartLiveCommand;
use App\Processes\PartAssessments;

/**
 * A committed chunk of a check's part is read at once by the part's approved reader; a part with no approved pair is
 * left to its activity view.
 */
#[InCommandTransaction]
final readonly class ReadOutputLive implements Listener
{
    public function __construct(private PartAssessments $assessments, private CommandBus $commands) {}

    public function handle(OutputChunkCommitted $committed): void
    {
        $part = PartRun::query()->whereKey($committed->partRunId)->first();

        if ($part === null || $this->assessments->pairOf($part) === []) {
            return;
        }

        $this->commands->run(new ReadPartLiveCommand($part->id));
    }
}
