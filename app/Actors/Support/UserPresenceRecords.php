<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\UserPresences;
use App\Actors\Models\UserPresence;
use Carbon\CarbonImmutable;

/**
 * Counts present users from their presence rows with the configured presence window.
 */
final readonly class UserPresenceRecords implements UserPresences
{
    public function __construct(private PresenceWindow $window) {}

    public function freshCountAmong(array $userIds, CarbonImmutable $observedAt): int
    {
        if ($userIds === []) {
            return 0;
        }

        return UserPresence::query()->freshAt($observedAt, $this->window)->whereIn('user_id', $userIds)->count();
    }
}
