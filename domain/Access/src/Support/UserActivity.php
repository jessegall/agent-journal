<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AutoAssignmentActivity;
use Domain\Access\Models\User;

/**
 * A user may take work whenever the journal admits them; a user needs no running session.
 */
final readonly class UserActivity implements AutoAssignmentActivity
{
    public function __construct(private JournalAccessPolicy $access) {}

    public function mayTakeWork(ActorIdentity $actor): bool
    {
        $user = User::query()->find($actor->id);

        return $user !== null && $this->access->allows($user);
    }
}
