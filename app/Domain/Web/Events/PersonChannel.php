<?php

declare(strict_types=1);

namespace App\Domain\Web\Events;

use App\Domain\Access\Contracts\JournalAccessPolicy;
use App\Domain\Access\Models\User;

/**
 * The private channel of one person: only that signed-in person joins it, and only while Access lets them use the
 * journal. The id in the channel name is compared with the session's person, never trusted on its own.
 */
final readonly class PersonChannel
{
    public const string PATTERN = 'journal.person.{personId}';

    public function __construct(private JournalAccessPolicy $access) {}

    public static function nameFor(int $personId): string
    {
        return "journal.person.{$personId}";
    }

    public function join(User $person, string $personId): bool
    {
        return (string) $person->id === $personId && $this->access->allows($person);
    }
}
