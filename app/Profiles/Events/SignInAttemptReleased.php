<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Profiles\Contracts\ShownOnAccounts;

/**
 * A sign-in attempt was released to its host, once no use of its account still runs.
 */
final readonly class SignInAttemptReleased implements ShownOnAccounts
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
