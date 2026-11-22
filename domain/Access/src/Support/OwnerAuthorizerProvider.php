<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Contracts\ChatEligibility;
use App\Actors\Contracts\ChatMemberPolicies;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\JournalAdmission;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\UnrestrictedAuthorizer;
use App\Actors\Values\ChatMemberAuthority;
use App\Actors\Values\OwnerAuthority;

/**
 * A user's authorizer: an owner the journal's access policy admits may do anything; anyone else may do nothing. A
 * user has no stored agent profile.
 */
final readonly class OwnerAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(
        private JournalAdmission $admission,
        private CurrentActor $actors,
        private ChatEligibility $chats,
        private ChatMemberPolicies $chatPolicies,
    ) {}

    /**
     * The acting user was admitted where its owner authority was installed, at sign-in or for the console; any other
     * authority is judged by the admission now.
     *
     * @throws ActorNotAllowed
     */
    public function forActor(Actor $actor): Authorizer
    {
        if ($this->actors->authority() instanceof OwnerAuthority) {
            return new UnrestrictedAuthorizer();
        }

        if ($this->actors->authority() instanceof ChatMemberAuthority) {
            return new ChatMemberAuthorizer($this->chatPolicies);
        }

        return $this->forTarget($actor);
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        if ($this->admission->admits($target)) {
            return new UnrestrictedAuthorizer();
        }

        if ($this->chats->isAdmitted(ActorIdentity::of($target), null)) {
            return new ChatMemberAuthorizer($this->chatPolicies);
        }

        throw ActorNotAllowed::asNonOwner();
    }
}
