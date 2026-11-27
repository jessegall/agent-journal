<?php

declare(strict_types=1);

namespace App\Concerns;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * Orders a model's rows by when they were made, the key breaking a tie.
 */
trait OrdersByCreation
{
    /**
     * The rows by created at, then by key.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function byCreatedAt(Builder $query): void
    {
        $query->orderBy($this->getCreatedAtColumn());
        $query->orderBy($this->getKeyName());
    }
}
