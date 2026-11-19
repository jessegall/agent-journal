<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\AllowsEverything;

/**
 * A user's authorizer: an owner the journal's access policy admits may do anything; anyone else may do nothing. A
 * user has no stored agent profile.
 */
final readonly class OwnerAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(private JournalAccessPolicy $access) {}

    /**
     * @throws ActorNotAllowed
     */
    public function forActor(Actor $actor): Authorizer
    {
        return $this->access->allows($actor) ? new AllowsEverything() : throw ActorNotAllowed::asNonOwner();
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        return $this->forActor($target);
    }
}
