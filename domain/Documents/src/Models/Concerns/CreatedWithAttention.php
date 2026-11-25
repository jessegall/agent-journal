<?php

declare(strict_types=1);

namespace Domain\Documents\Models\Concerns;

use App\Contracts\Actors\Actor;
use Domain\Documents\Enums\AttentionState;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * The scopes a document and a report share: their creator, and whether they still ask for attention.
 */
trait CreatedWithAttention
{
    /**
     * Only the records in this attention state, or every record when none is given.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function inAttention(Builder $query, AttentionState|null $state): void
    {
        $query->when($state !== null, fn (Builder $records) => $records->where('attention', $state?->value));
    }

    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, Actor $actor): void
    {
        $query->where('creator_type', $actor->actorType())->where('creator_id', $actor->actorId());
    }
}
