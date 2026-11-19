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
 * actor's rows through acrossOwners.
 */
trait BelongsToOneActor
{
    use HasActorColumns;
    use ReadsForActor;

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
     * @return class-string<ActorScope>
     */
    protected static function ownerScope(): string
    {
        return ActorScope::class;
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
}
