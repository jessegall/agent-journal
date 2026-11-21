<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Profiles\Contracts\ShownOnAccounts;

/**
 * The owner asked a sign-in attempt's failed cleanup to run again.
 */
final readonly class SignInAttemptCleanupRetried implements ShownOnAccounts
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
