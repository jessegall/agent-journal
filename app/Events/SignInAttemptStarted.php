<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\ShownOnAccounts;

/**
 * A sign-in attempt started, for a new account or to sign a saved one in again.
 */
final readonly class SignInAttemptStarted implements ShownOnAccounts
{
    public function __construct(public string $driver, public string $attemptId, public string|null $accountId) {}

    public function driver(): string
    {
        return $this->driver;
    }

    /**
     * The account the attempt signs in again, or the attempt itself while it adds a new account.
     */
    public function subjectId(): string
    {
        return $this->accountId ?? $this->attemptId;
    }
}
