<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\SignInAttemptEvent;

/**
 * A sign-in attempt kept the fingerprint of the identity it signed in as.
 */
final readonly class SignInAttemptFingerprinted implements AccountEvent, SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId) {}
}
