<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Contracts\UserPresences;
use App\Actors\Enums\ActorType;
use Carbon\CarbonImmutable;

/**
 * Counts the present users in one count query: a fresh presence row of a user the journal admits now. A user has one
 * row, so two tabs or devices count one.
 */
final readonly class PresentUserCounter implements ActiveActorCounter
{
    public function __construct(
        private JournalAccessPolicy $access,
        private UserPresences $presences,
    ) {}

    public static function type(): ActorType
    {
        return ActorType::User;
    }

    public function count(CarbonImmutable $observedAt): int
    {
        return $this->presences->freshCountAmong($this->access->allowedUserIds(), $observedAt);
    }
}
