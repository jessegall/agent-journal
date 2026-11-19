<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * What a host needs to make a claimed start's process: its key for every later report, the session, the program and
 * the account folder on the host with the sign-in generation it runs in.
 */
final readonly class ClaimedStart
{
    public function __construct(
        public string $startKey,
        public string $sessionId,
        public string $directory,
        public int $generation,
    ) {}
}
