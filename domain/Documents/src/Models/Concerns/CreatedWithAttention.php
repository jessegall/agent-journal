<?php

declare(strict_types=1);

namespace Domain\Documents\Models\Concerns;

use App\Actors\Contracts\Actor;
use Domain\Documents\Enums\AttentionStatus;
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
    protected function inAttention(Builder $query, AttentionStatus|null $status): void
    {
        $query->when($status !== null, fn (Builder $records) => $records->where('attention', $status?->value));
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
