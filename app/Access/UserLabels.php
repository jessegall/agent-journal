<?php

declare(strict_types=1);

namespace App\Access;

use App\Actors\Contracts\ActorLabelProvider;
use App\Actors\Contracts\CurrentActor;
use App\Models\Access\User;

/**
 * Users' display names; every signed-in actor may see them, as it may see assignees' names.
 */
final readonly class UserLabels implements ActorLabelProvider
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @param  list<string>  $actorIds
     * @return array<string, string>
     */
    public function namesOf(array $actorIds): array
    {
        $this->actors->actor();
        $ids = array_values(array_unique($actorIds));

        return User::query()->whereKey($ids)->readExactly(count($ids))->get()
            ->mapWithKeys(fn (User $user) => [$user->id => $user->name])
            ->all();
    }
}
