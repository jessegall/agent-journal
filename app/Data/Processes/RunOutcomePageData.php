<?php

declare(strict_types=1);

namespace App\Data\Processes;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The outcome-only page of a run: its safe summary while the reader may see it, nothing once that ended.
 */
#[TypeScript]
final class RunOutcomePageData extends Data
{
    public function __construct(
        public readonly string $runId,
        public readonly RunOutcomeSummaryData|Optional $summary = new Optional(),
    ) {}
}
