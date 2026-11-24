<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\AccountCleanupEvent;
use App\Contracts\Accounts\ShownOnAccounts;

/**
 * The owner asked a saved account's failed cleanup to run again.
 */
final readonly class AccountCleanupRetried extends AccountEvent implements AccountCleanupEvent, ShownOnAccounts
{
    public function __construct(public string $driver, public string $accountId) {}

    public function driver(): string
    {
        return $this->driver;
    }

    public function subjectId(): string
    {
        return $this->accountId;
    }
}
