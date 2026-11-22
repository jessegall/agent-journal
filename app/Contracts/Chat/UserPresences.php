<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use Carbon\CarbonImmutable;

/**
 * The users' presence rows, for the owner of users: how many of the named users are present at an observation time.
 */
interface UserPresences
{
    /**
     * Counts, in one query, the named users whose beat plus the presence window is strictly later than the time.
     *
     * @param  list<string>  $userIds
     */
    public function freshCountAmong(array $userIds, CarbonImmutable $observedAt): int;
}
