<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorProvider;
use App\Contracts\Admission\JournalAdmission;
use App\Exceptions\ActorUnavailable;
use App\Models\Access\User;
use App\Support\ActorIdentity;

/**
 * Users as actors: a user that exists and that the journal's admission lets in.
 */
final readonly class UserActors implements ActorProvider
{
    public function __construct(private JournalAdmission $admission) {}

    public function actor(ActorIdentity $identity): Actor
    {
        $user = User::query()->whereKey($identity->id)->first();

        if ($user !== null
            && $this->admission->admits($user)) {
            return $user;
        }

        throw ActorUnavailable::forIdentity($identity);
    }
}
