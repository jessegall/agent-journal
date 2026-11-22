<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\ShownOnAccounts;

/**
 * A sign-in attempt ended without completing: cancelled, failed, interrupted or expired; the account it wrote, if
 * any, is released by the required listener in the same transaction.
 */
final readonly class SignInAttemptFinished implements ShownOnAccounts
{
    public function __construct(public string $driver, public string $attemptId, public string|null $accountId) {}

    public function driver(): string
    {
        return $this->driver;
    }

    /**
     * The account the attempt wrote, or the attempt itself when it had none.
     */
    public function subjectId(): string
    {
        return $this->accountId ?? $this->attemptId;
    }
}
