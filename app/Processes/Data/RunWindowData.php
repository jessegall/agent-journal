<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Data;

/**
 * One run as its page shows it: the snapshot the live updates keep current, each part's escaped output tails and the
 * problems of its latest assessment.
 */
final class RunWindowData extends Data
{
    /**
     * @param  array<string, list<PartOutputData>>  $outputs  part id => its streams
     * @param  array<string, list<ProblemData>>  $problems  part id => the problems of its latest assessment
     */
    public function __construct(
        public readonly RunSnapshotData $snapshot,
        public readonly array $outputs,
        public readonly array $problems,
        public readonly string|null $stopReason,
    ) {}
}
