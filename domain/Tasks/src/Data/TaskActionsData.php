<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the caller may do with the task now, as the domain decides it from the task's state and the caller's grants:
 * start it, block its current run, or cancel it, with the reason when start is not offered.
 */
#[TypeScript]
final class TaskActionsData extends Data
{
    public function __construct(
        public readonly bool $mayStart,
        public readonly bool $mayBlock,
        public readonly bool $mayCancel,
        public readonly int $runNumber,
        public readonly string|Optional $startReason = new Optional(),
    ) {}
}
