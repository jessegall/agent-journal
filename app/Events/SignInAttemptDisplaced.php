<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A sign-in attempt was settled by an account that had already signed in, so its own folder is cleaned up.
 */
final readonly class SignInAttemptDisplaced extends AccountEvent implements SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId, public string $accountId) {}
}
