<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Contracts\Actors\ActiveActorCounter;
use App\Contracts\Chat\AdmittedRecipients;
use App\Contracts\Chat\UserPresences;
use App\Enums\ActorType;
use Carbon\CarbonImmutable;

/**
 * Counts the present users in one count query: a fresh presence row of a user the journal admits now. A user has one
 * row, so two tabs or devices count one.
 */
final readonly class PresentUserCounter implements ActiveActorCounter
{
    public function __construct(
        private AdmittedRecipients $recipients,
        private UserPresences $presences,
    ) {}

    public static function type(): ActorType
    {
        return ActorType::User;
    }

    public function count(CarbonImmutable $observedAt): int
    {
        return $this->presences->freshCountAmong($this->recipients->userIds(), $observedAt);
    }
}
