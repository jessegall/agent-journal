<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Contracts\Actor;
use App\Contracts\ActorProvider;
use App\Contracts\JournalAdmission;
use App\Exceptions\ActorUnavailable;
use App\Support\ActorIdentity;
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
