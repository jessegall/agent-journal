<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Authorization\Authorizer;
use App\Contracts\Authorization\AuthorizerProvider;
use App\Contracts\Inboxes\InboxEligibility;
use App\Contracts\Inboxes\InboxMemberPolicies;
use App\Exceptions\ActorNotAllowed;
use App\Support\ActorIdentity;
use App\Support\UnrestrictedAuthorizer;
use App\Values\InboxMemberAuthority;
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
        private InboxEligibility $chats,
        private InboxMemberPolicies $chatPolicies,
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

        if ($this->actors->authority() instanceof InboxMemberAuthority) {
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
