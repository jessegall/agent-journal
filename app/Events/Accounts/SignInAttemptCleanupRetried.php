<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\ShownOnAccounts;
use App\Accounts\Contracts\SignInAttemptEvent;

/**
 * The owner asked a sign-in attempt's failed cleanup to run again.
 */
final readonly class SignInAttemptCleanupRetried implements AccountEvent, ShownOnAccounts, SignInAttemptEvent
{
    public function __construct(public string $driver, public string $attemptId) {}

    public function driver(): string
    {
        return $this->driver;
    }

    public function subjectId(): string
    {
        return $this->attemptId;
    }
}
