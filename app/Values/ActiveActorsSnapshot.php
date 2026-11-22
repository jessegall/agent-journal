<?php

declare(strict_types=1);

namespace App\Values;

use Carbon\CarbonImmutable;

/**
 * The present actors at one database time: fresh agent sessions (two of one agent count two) and present users.
 */
final readonly class ActiveActorsSnapshot
{
    public function __construct(
        public CarbonImmutable $observedAt,
        public int $agentSessions,
        public int $users,
    ) {}

    public function total(): int
    {
        return $this->agentSessions + $this->users;
    }
}
