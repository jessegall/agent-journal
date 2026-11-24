<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A sign-in attempt took the user's answer and checks it.
 */
final readonly class SignInAttemptAnswerAccepted extends AccountEvent implements SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId) {}
}
