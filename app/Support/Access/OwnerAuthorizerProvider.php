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
use App\Support\ActorReference;
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
