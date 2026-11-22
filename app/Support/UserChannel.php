<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Chat\ChatEligibility;

/**
 * The private channel of one user: only that signed-in user joins it, and only while Access lets them use the
 * journal. The id in the channel name is compared with the session's user, never trusted on its own.
 */
final readonly class UserChannel
{
    public const string PATTERN = 'journal.user.{userId}';

    public function __construct(private JournalAdmission $admission, private ChatEligibility $chats) {}

    public static function nameFor(string $userId): string
    {
        return "journal.user.{$userId}";
    }

    public function join(Actor $user, string $userId): bool
    {
        return (string) $user->actorId() === $userId
            && ($this->admission->admits($user) || $this->chats->isAdmitted(ActorIdentity::of($user), null));
    }
}
