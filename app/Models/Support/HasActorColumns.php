<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Support\ActorReference;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * A model whose rows name the actor that made them in actor_type and actor_id columns.
 */
trait HasActorColumns
{
    /**
     * The rows one actor made; the columns are named with the model's table, so a join keeps them apart.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function byActor(Builder $query, ActorReference $actor): void
    {
        $type = $query->qualifyColumn('actor_type');
        $id = $query->qualifyColumn('actor_id');

        $query->where($type, $actor->type)->where($id, $actor->id);
    }

    /**
     * The actor the row names, read from its stored columns whether or not the model casts them.
     */
    public function actor(): ActorReference
    {
        $columns = $this->getAttributes();

        return ActorReference::fromStored((string) $columns['actor_type'], (string) $columns['actor_id']);
    }

    /**
     * Whether the row names this actor.
     */
    public function isByActor(ActorReference $actor): bool
    {
        return $this->actor()->isSameAs($actor);
    }
}
