<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A sign-in attempt waits for the user to answer its challenge.
 */
final readonly class SignInAttemptHandedToUser extends AccountEvent implements SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId) {}
}
