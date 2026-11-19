<?php

declare(strict_types=1);

namespace App\Communication\Models\Scopes;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\MemberInboxes;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * The messages an actor may see: those of the inboxes it belongs to now, coming in or going out, those it wrote, and
 * the answers to those it wrote. Membership is read as a subquery on every read, never kept between requests.
 *
 * @implements Scope<Model>
 */
final readonly class MessageVisibility implements Scope
{
    /**
     * @param  Closure(): ActorVisibility  $visibility
     * @param  Closure(): CurrentActor  $actors
     * @param  Closure(): MemberInboxes  $inboxes
     */
    public function __construct(private Closure $visibility, private Closure $actors, private Closure $inboxes) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        ($this->visibility)()->ownRows($builder, function (Builder $query) use ($model): void {
            $actor = ActorIdentity::of(($this->actors)()->actor());
            $inboxIds = ($this->inboxes)()->inboxIdsOf($actor);

            $query->where(fn (Builder $visible) => $visible
                ->whereIn($model->qualifyColumn('source_inbox_id'), $inboxIds)
                ->orWhereIn($model->qualifyColumn('destination_inbox_id'), $inboxIds)
                ->orWhere(fn (Builder $authored) => $authored
                    ->where($model->qualifyColumn('sender_type'), $actor->type->value)
                    ->where($model->qualifyColumn('sender_id'), $actor->id))
                ->orWhereIn($model->qualifyColumn('reply_to_id'), fn ($originals) => $originals
                    ->select('id')
                    ->from($model->getTable())
                    ->where('sender_type', $actor->type->value)
                    ->where('sender_id', $actor->id)));
        });
    }
}
