<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a user a request entitled may see of another actor's run: its display label, a short attempt reference, the
 * terminal result and when it was recorded, and whether the full run is theirs to open. No command, path, log, output
 * or problem.
 */
#[TypeScript]
final class RunOutcomeSummaryData extends Data
{
    public function __construct(
        public readonly string $runId,
        public readonly string $label,
        public readonly string $attemptReference,
        public readonly string $result,
        public readonly string $completedAt,
        public readonly bool $mayOpenFullRun,
    ) {}
}
