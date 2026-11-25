<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Assignments\AutoAssignmentActivity;
use App\Support\ActorIdentity;
use App\Models\Access\User;

/**
 * A user may take work whenever the journal admits them; a user needs no running session.
 */
final readonly class UserActivity implements AutoAssignmentActivity
{
    public function __construct(private JournalAdmission $admission) {}

    public function mayTakeWork(ActorIdentity $actor): bool
    {
        $user = User::query()->find($actor->id);

        return $user !== null && $this->admission->admits($user);
    }
}
