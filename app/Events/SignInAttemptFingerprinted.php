<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A sign-in attempt kept the fingerprint of the identity it signed in as.
 */
final readonly class SignInAttemptFingerprinted extends AccountEvent implements SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId) {}
}
