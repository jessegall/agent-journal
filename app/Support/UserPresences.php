<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Presence\UserPresences as UserPresencesContract;
use App\Models\Presence\UserPresence;
use Carbon\CarbonImmutable;

/**
 * Counts present users from their presence rows with the configured presence window.
 */
final readonly class UserPresences implements UserPresencesContract
{
    public function __construct(private PresenceWindow $window) {}

    public function freshCountAmong(array $ids, CarbonImmutable $observedAt): int
    {
        if ($ids === []) {
            return 0;
        }

        return UserPresence::query()->freshAt($observedAt, $this->window)->ofUsers($ids)->count();
    }
}
