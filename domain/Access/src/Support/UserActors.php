<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorProvider;
use App\Actors\Contracts\JournalAdmission;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use Domain\Access\Models\User;

/**
 * Users as actors: a user that exists and that the journal's admission lets in.
 */
final readonly class UserActors implements ActorProvider
{
    public function __construct(private JournalAdmission $admission) {}

    public function actor(ActorIdentity $identity): Actor
    {
        $user = User::query()->whereKey($identity->id)->first();

        return $user !== null
            && $this->admission->admits($user)
            ? $user
            : throw ActorUnavailable::forIdentity($identity);
    }
}
