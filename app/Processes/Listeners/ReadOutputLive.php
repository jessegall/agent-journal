<?php

declare(strict_types=1);

namespace App\Processes\Listeners;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Processes\Commands\ReadPartLive;
use App\Processes\Events\OutputChunkCommitted;
use App\Processes\Models\PartRun;
use App\Processes\Support\PartAssessments;

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

        $this->commands->run(new ReadPartLive($part->id));
    }
}
