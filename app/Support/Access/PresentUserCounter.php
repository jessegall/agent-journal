<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Actors\ActiveActorCounter;
use App\Contracts\Messages\AdmittedRecipients;
use App\Contracts\Presence\UserPresences;
use App\Models\Access\User;
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

    public static function type(): string
    {
        return User::storedType();
    }

    public function count(CarbonImmutable $observedAt): int
    {
        return $this->presences->freshCountAmong($this->recipients->userIds(), $observedAt);
    }
}
