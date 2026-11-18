<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorProvider;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Web\Contracts\JournalAccessPolicy;
use Domain\Access\Models\User;

/**
 * Users as actors: a user that exists and that the access policy lets into the journal.
 */
final readonly class UserActors implements ActorProvider
{
    public function __construct(private JournalAccessPolicy $access) {}

    public function actor(ActorIdentity $identity): Actor
    {
        $user = $identity->type === ActorType::User ? User::query()->whereKey($identity->id)->first() : null;

        return $user !== null && $this->access->allows($user) ? $user : throw ActorUnavailable::forIdentity($identity);
    }
}
