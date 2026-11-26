<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\SignInAttemptEvent;

/**
 * A host took a sign-in attempt to run it.
 */
final readonly class SignInAttemptClaimed implements AccountEvent, SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId, public string $hostId) {}
}
