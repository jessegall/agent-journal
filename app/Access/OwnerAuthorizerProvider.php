<?php

declare(strict_types=1);

namespace App\Access;

use App\Access\Contracts\Authorizer;
use App\Access\Contracts\AuthorizerProvider;
use App\Access\Contracts\JournalAdmission;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentActor;
use App\Exceptions\ActorNotAllowed;
use App\Inboxes\Contracts\InboxEligibility;
use App\Inboxes\Contracts\InboxMemberPolicies;
use App\Support\ActorReference;
use App\Values\InboxMemberAuthority;

/**
 * A user's authorizer: an owner the journal's access policy admits may do anything; anyone else may do nothing. A
 * user has no stored agent profile.
 */
final readonly class OwnerAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(
        private JournalAdmission $admission,
        private CurrentActor $actors,
        private InboxEligibility $inboxes,
        private InboxMemberPolicies $memberPolicies,
    ) {}

    /**
     * The acting user was admitted where its owner authority was installed, at sign-in or for the console; any other
     * authority is judged by the admission now.
     *
     * @throws ActorNotAllowed
     */
    public function forActor(Actor $actor): Authorizer
    {
        if ($this->isOwner($actor)) {
            return new UnrestrictedAuthorizer();
        }

        if ($this->actors->authority() instanceof InboxMemberAuthority) {
            return new InboxMemberAuthorizer($this->memberPolicies);
        }

        return $this->forTarget($actor);
    }

    /**
     * Whether the acting user holds owner authority: installed as an owner, or admitted now under an authority that is
     * no inbox member's.
     */
    public function isOwner(Actor $actor): bool
    {
        $authority = $this->actors->authority();

        if ($authority instanceof OwnerAuthority) {
            return true;
        }

        return ! $authority instanceof InboxMemberAuthority && $this->admission->admits($actor);
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        if ($this->admission->admits($target)) {
            return new UnrestrictedAuthorizer();
        }

        if ($this->inboxes->isAdmitted(ActorReference::of($target), null)) {
            return new InboxMemberAuthorizer($this->memberPolicies);
        }

        throw ActorNotAllowed::asNonOwner();
    }
}
