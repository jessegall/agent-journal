<?php

declare(strict_types=1);

namespace App\Actors\Models\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * For a model whose rows belong to one actor, kept as actor_type and actor_id: every query sees only the calling
 * actor's rows, the journal's own work on another actor's rows reads them through ownedBy, and a user inspects every
 * actor's rows through visibleToUser.
 */
trait BelongsToOneActor
{
    public static function bootBelongsToOneActor(): void
    {
        static::addGlobalScope(new ActorScope(static fn (): CurrentActor => Container::getInstance()->make(CurrentActor::class)));
    }

    /**
     * Gives the row to its actor.
     */
    public function belongTo(ActorIdentity $actor): void
    {
        $this->setAttribute('actor_type', $actor->type->value);
        $this->setAttribute('actor_id', $actor->id);
    }

    /**
     * The explicit read of one actor's rows, for the journal's own work on that actor; it lifts the current-actor limit.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, ActorIdentity $actor): void
    {
        $query->withoutGlobalScope(ActorScope::class)->where($query->qualifyColumn('actor_type'), $actor->type->value)->where($query->qualifyColumn('actor_id'), $actor->id);
    }

    /**
     * The read for the user acting in this request: every actor's rows the user may inspect; any other actor is refused.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function visibleToUser(Builder $query): void
    {
        Container::getInstance()->make(CurrentActor::class)->actor()->requireUser();

        $query->withoutGlobalScope(ActorScope::class);
    }

    /**
     * The read for whoever acts in this request: a user reads through visibleToUser, anyone else only its own rows.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function forActor(Builder $query): void
    {
        $actors = Container::getInstance()->make(CurrentActor::class);

        if ($actors->isSignedIn() && $actors->actor()->isUser()) {
            $query->visibleToUser();
        }
    }

    /**
     * The row locked for a change that must happen once, among the actor's own rows or the rows no actor holds yet,
     * such as a run nobody follows; null when the actor may not have it.
     */
    public static function lockedForActorOrUnheld(string $id): static|null
    {
        return static::query()->forActor()->whereKey($id)->lockForUpdate()->first()
            ?? static::query()->withoutGlobalScope(ActorScope::class)->whereNull('actor_id')->whereKey($id)->lockForUpdate()->first();
    }

    /**
     * Binds a route to a row the acting actor may read.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    public function resolveRouteBinding($value, $field = null): Model|null
    {
        Container::getInstance()->make(CurrentActor::class)->actor();

        return $this->newQuery()->forActor()->where($field ?? $this->getRouteKeyName(), $value)->first();
    }
}
