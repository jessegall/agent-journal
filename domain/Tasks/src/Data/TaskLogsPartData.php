<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a task's Logs tab as a native part: the pages of its log the reader asked for.
 */
#[TypeScript]
final class TaskLogsPartData extends Data
{
    public function __construct(public readonly TaskLogsData $logs) {}
}
