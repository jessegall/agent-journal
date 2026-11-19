<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\JournalAdmission;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\AllowsEverything;
use App\Actors\Values\OwnerAuthority;

/**
 * A user's authorizer: an owner the journal's access policy admits may do anything; anyone else may do nothing. A
 * user has no stored agent profile.
 */
final readonly class OwnerAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(private JournalAdmission $admission, private CurrentActor $actors) {}

    /**
     * The acting user was admitted where its owner authority was installed, at sign-in or for the console; any other
     * authority is judged by the admission now.
     *
     * @throws ActorNotAllowed
     */
    public function forActor(Actor $actor): Authorizer
    {
        if ($this->actors->authority() instanceof OwnerAuthority) {
            return new AllowsEverything();
        }

        return $this->forTarget($actor);
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        return $this->admission->admits($target) ? new AllowsEverything() : throw ActorNotAllowed::asNonOwner();
    }
}
