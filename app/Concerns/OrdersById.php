<?php

declare(strict_types=1);

namespace App\Concerns;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * Orders a model's rows by their sortable ULID, which follows the order the rows were written in.
 */
trait OrdersById
{
    /**
     * The rows in the order they were written, oldest first.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function oldestFirst(Builder $query): void
    {
        $query->orderBy($this->getQualifiedKeyName());
    }

    /**
     * The rows newest first.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function newestFirst(Builder $query): void
    {
        $query->orderByDesc($this->getQualifiedKeyName());
    }
}
