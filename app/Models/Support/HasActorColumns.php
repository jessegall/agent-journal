<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Enums\ActorType;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * A model whose rows name the actor that made them in actor_type and actor_id columns.
 */
trait HasActorColumns
{
    /**
     * The rows one actor made.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function byActor(Builder $query, ActorIdentity $actor): void
    {
        $query->where('actor_type', $actor->type->value)->where('actor_id', $actor->id);
    }

    /**
     * The actor the row names, read from its stored columns whether or not the model casts them.
     */
    public function actor(): ActorIdentity
    {
        $columns = $this->getAttributes();

        return new ActorIdentity(ActorType::from((string) $columns['actor_type']), (string) $columns['actor_id']);
    }

    /**
     * Whether the row names this actor.
     */
    public function isByActor(ActorIdentity $actor): bool
    {
        return $this->actor()->isSameAs($actor);
    }
}
