<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\AccountCleanupEvent;
use App\Accounts\Contracts\ShownOnAccounts;

/**
 * The owner asked a saved account's failed cleanup to run again.
 */
final readonly class AccountCleanupRetried implements AccountCleanupEvent, AccountEvent, ShownOnAccounts
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
