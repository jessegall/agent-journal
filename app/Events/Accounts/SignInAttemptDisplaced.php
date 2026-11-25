<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A sign-in attempt was settled by an account that had already signed in, so its own folder is cleaned up.
 */
final readonly class SignInAttemptDisplaced implements AccountEvent, SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId, public string $accountId) {}
}
