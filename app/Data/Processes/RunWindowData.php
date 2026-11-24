<?php

declare(strict_types=1);

namespace App\Data\Processes;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One run as its page shows it: the snapshot the live updates keep current, each part's escaped output tails and the
 * problems of its latest assessment.
 */
#[TypeScript]
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
