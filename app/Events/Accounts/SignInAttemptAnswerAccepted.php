<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A sign-in attempt took the user's answer and checks it.
 */
final readonly class SignInAttemptAnswerAccepted implements AccountEvent, SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId) {}
}
