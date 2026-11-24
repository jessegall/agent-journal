<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\ShownOnAccounts;
use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * The owner asked a sign-in attempt's failed cleanup to run again.
 */
final readonly class SignInAttemptCleanupRetried extends AccountEvent implements ShownOnAccounts, SignInAttemptEvent
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
