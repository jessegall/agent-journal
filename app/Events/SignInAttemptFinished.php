<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\ShownOnAccounts;
use App\Contracts\Accounts\SignInAttemptEvent;

/**
 * A sign-in attempt ended without completing: cancelled, failed, interrupted or expired; the account it wrote, if
 * any, is released by the transaction listener in the same transaction.
 */
final readonly class SignInAttemptFinished extends AccountEvent implements ShownOnAccounts, SignInAttemptEvent
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
