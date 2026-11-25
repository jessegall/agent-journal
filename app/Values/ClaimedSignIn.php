<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Accounts\SignInMethod;

/**
 * A sign-in a host took to run: the attempt, its driver and method, the private folder its driver signs in to on the host,
 * the sign-in generation every report carries, and its deadline.
 */
final readonly class ClaimedSignIn
{
    public function __construct(
        public string $attemptId,
        public string $driver,
        public SignInMethod $method,
        public string $directory,
        public int $generation,
        public string $expiresAt,
        // The account a reconnect signs in again, none for a new account.
        public string|null $accountId,
    ) {}
}
