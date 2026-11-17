<?php

declare(strict_types=1);

namespace App\Core\Web\Events;

use App\Core\Contracts\Actor;
use App\Core\Web\Contracts\JournalAccessPolicy;

/**
 * The private channel of one user: only that signed-in user joins it, and only while Access lets them use the
 * journal. The id in the channel name is compared with the session's user, never trusted on its own.
 */
final readonly class UserChannel
{
    public const string PATTERN = 'journal.user.{userId}';

    public function __construct(private JournalAccessPolicy $access) {}

    public static function nameFor(int $userId): string
    {
        return "journal.user.{$userId}";
    }

    public function join(Actor $user, string $userId): bool
    {
        return (string) $user->actorId() === $userId && $this->access->allows($user);
    }
}
