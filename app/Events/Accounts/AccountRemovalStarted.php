<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\ShownOnAccounts;

/**
 * The owner began removing a saved account.
 */
final readonly class AccountRemovalStarted implements AccountEvent, ShownOnAccounts
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
