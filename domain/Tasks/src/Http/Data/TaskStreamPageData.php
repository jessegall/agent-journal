<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of a task's Logs, oldest first, read before the cursor it names ('' for the newest), with the cursor of the
 * page before it while older entries remain.
 */
#[TypeScript]
final class TaskStreamPageData extends Data
{
    /**
     * @param  list<TaskStreamEntryData>  $entries
     */
    public function __construct(
        public readonly string $before,
        #[DataCollectionOf(TaskStreamEntryData::class)]
        public readonly array $entries,
        public readonly string|Optional $olderBefore = new Optional(),
    ) {}
}
