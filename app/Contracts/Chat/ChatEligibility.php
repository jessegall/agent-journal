<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Enums\ChatPermission;
use App\Support\ActorIdentity;

/**
 * Which users take part in chats of one environment, and what each may do there; the installation's owner holds every
 * permission, a disabled account none. An environment id of null is this installation's own work.
 */
interface ChatEligibility
{
    /**
     * Holds the user's account and active grant under row locks to the end of the transaction, so a change to the
     * user's membership never commits against a grant revoked meanwhile. It is the first lock a membership change takes.
     */
    public function lockAdmission(ActorIdentity $user, string|null $environmentId): void;

    public function isAdmitted(ActorIdentity $user, string|null $environmentId): bool;

    public function holds(ActorIdentity $user, ChatPermission $permission, string|null $environmentId): bool;

    /**
     * The ids of the admitted users who may receive an invitation, at most the given number, for candidate search.
     *
     * @return list<string>
     */
    public function invitableUserIds(string|null $environmentId, int $limit): array;
}
