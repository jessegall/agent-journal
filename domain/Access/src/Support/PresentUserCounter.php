<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Enums\ActorType;
use App\Actors\Models\UserPresence;
use App\Actors\Support\PresenceWindow;
use App\Web\Contracts\JournalAccessPolicy;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;

/**
 * Counts the present users in one count query: a fresh presence row of a user who still exists and may use the
 * journal. A user has one row, so two tabs or devices count one.
 */
final readonly class PresentUserCounter implements ActiveActorCounter
{
    public function __construct(
        private JournalAccessPolicy $access,
        private PresenceWindow $window,
    ) {}

    public static function type(): ActorType
    {
        return ActorType::User;
    }

    public function count(CarbonImmutable $observedAt): int
    {
        return UserPresence::query()->freshAt($observedAt, $this->window)
            ->whereIn('user_id', User::query()->select('id')->whereKey($this->access->allowedUserIds()))
            ->count();
    }
}
