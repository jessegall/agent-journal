<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Contracts\Actor;
use App\Contracts\Authorizer;
use App\Contracts\AuthorizerProvider;
use App\Contracts\ChatEligibility;
use App\Contracts\ChatMemberPolicies;
use App\Contracts\CurrentActor;
use App\Contracts\JournalAdmission;
use App\Exceptions\ActorNotAllowed;
use App\Support\ActorIdentity;
use App\Support\UnrestrictedAuthorizer;
use App\Values\ChatMemberAuthority;
use App\Values\OwnerAuthority;

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
