<?php

declare(strict_types=1);

namespace Domain\Tasks\Models\Concerns;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * The entries a task keeps numbered in one sequence, such as its history and its log, read by task and by number.
 */
trait TaskSequence
{
    /**
     * The task's entries.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ofTask(Builder $query, string $taskId): void
    {
        $query->where('task_id', $taskId);
    }

    /**
     * The entries before that sequence number; all of them with none.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function before(Builder $query, int|null $sequence): void
    {
        $query->when($sequence !== null, fn (Builder $earlier) => $earlier->where('sequence', '<', $sequence));
    }

    /**
     * The entries newest sequence number first.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function newestSequenceFirst(Builder $query): void
    {
        $query->orderByDesc('sequence');
    }
}
