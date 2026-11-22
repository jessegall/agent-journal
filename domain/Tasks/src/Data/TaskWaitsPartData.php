<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a task's Waits tab as a native part: its waits both ways, what the caller may change, and its number.
 */
#[TypeScript]
final class TaskWaitsPartData extends Data
{
    public function __construct(
        public readonly TaskWaitsData $waits,
        public readonly TaskWaitActionsData $actions,
        public readonly string $number,
    ) {}
}
