<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * A sign-in a host took to run: the attempt, its program, the private folder its program signs in to on the host,
 * the sign-in generation every report carries, and its deadline.
 */
final readonly class ClaimedSignIn
{
    public function __construct(
        public string $attemptId,
        public string $program,
        public string $directory,
        public int $generation,
        public string $expiresAt,
    ) {}
}
