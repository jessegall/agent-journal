<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\SignInAttemptEvent;

/**
 * A sign-in attempt waits for the user to answer its challenge.
 */
final readonly class SignInAttemptHandedToUser implements AccountEvent, SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId) {}
}
