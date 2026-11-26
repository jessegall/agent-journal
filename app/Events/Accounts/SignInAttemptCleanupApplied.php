<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\SignInAttemptEvent;

/**
 * A host reported how far it cleaned a sign-in attempt's folder; finished says whether nothing is left.
 */
final readonly class SignInAttemptCleanupApplied implements AccountEvent, SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId, public bool $hasFinished) {}
}
