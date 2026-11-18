<?php

declare(strict_types=1);

namespace App\Communication\Models\Scopes;

use App\Actors\Contracts\CurrentActor;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits messages to those the current actor sent or received. It asks for the actor on every query, so a worker that
 * serves many requests never keeps an earlier request's actor; with no signed-in actor no message is visible.
 *
 * @implements Scope<Model>
 */
final readonly class MessageVisibility implements Scope
{
    /**
     * @param  Closure(): CurrentActor  $actors
     */
    public function __construct(private Closure $actors) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        $actors = ($this->actors)();
        if (! $actors->isSignedIn()) {
            $builder->whereRaw('false');

            return;
        }
        $actor = $actors->actor();
        $type = $actor->actorType()->value;
        $id = $actor->actorId();

        $builder->where(fn (Builder $either) => $either
            ->where(fn (Builder $sent) => $sent
                ->where($model->qualifyColumn('sender_type'), $type)
                ->where($model->qualifyColumn('sender_id'), $id))
            ->orWhere(fn (Builder $received) => $received
                ->where($model->qualifyColumn('recipient_type'), $type)
                ->where($model->qualifyColumn('recipient_id'), $id)));
    }
}
