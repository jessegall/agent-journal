<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A host reported how far it cleaned a sign-in attempt's folder; finished says whether nothing is left.
 */
final readonly class SignInAttemptCleanupApplied extends AccountEvent implements SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId, public bool $hasFinished) {}
}
