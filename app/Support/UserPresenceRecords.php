<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\UserPresences;
use App\Models\UserPresence;
use Carbon\CarbonImmutable;

/**
 * Counts present users from their presence rows with the configured presence window.
 */
final readonly class UserPresenceRecords implements UserPresences
{
    public function __construct(private PresenceWindow $window) {}

    public function freshCountAmong(array $ids, CarbonImmutable $observedAt): int
    {
        if ($ids === []) {
            return 0;
        }

        return UserPresence::query()->freshAt($observedAt, $this->window)->whereIn('user_id', $ids)->count();
    }
}
