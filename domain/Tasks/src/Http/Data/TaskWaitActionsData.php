<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the caller may do with a task's waits, as the domain decides it: add or remove a prerequisite (Edit on the
 * task) and waive a wait (Admin on it), the reason when none is offered, and the tasks matching a prerequisite search.
 */
#[TypeScript]
final class TaskWaitActionsData extends Data
{
    /**
     * @param  list<TaskWaitChoiceData>  $choices
     */
    public function __construct(
        public readonly bool $mayEdit,
        public readonly bool $mayWaive,
        #[DataCollectionOf(TaskWaitChoiceData::class)]
        public readonly array $choices,
        public readonly string|Optional $reason = new Optional(),
    ) {}
}
