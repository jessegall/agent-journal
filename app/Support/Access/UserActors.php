<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorProvider;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Inboxes\InboxEligibility;
use App\Exceptions\ActorUnavailable;
use App\Models\Access\User;
use App\Support\ActorReference;

/**
 * Users as actors: a user that exists and that the journal's admission lets in, as the owner or as an inbox member.
 */
final readonly class UserActors implements ActorProvider
{
    public function __construct(private JournalAdmission $admission, private InboxEligibility $inboxes) {}

    public function actor(ActorReference $identity): Actor
    {
        $user = User::query()->whereKey($identity->id)->first();

        if ($user !== null && ($this->admission->admits($user) || $this->inboxes->isAdmitted($identity, null))) {
            return $user;
        }

        throw ActorUnavailable::forIdentity($identity);
    }
}
