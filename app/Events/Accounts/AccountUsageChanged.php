<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\ShownOnAccounts;

/**
 * A usage reading of a saved account changed: a newer limit window, a new cost or a newer thread token count.
 */
final readonly class AccountUsageChanged implements AccountEvent, ShownOnAccounts
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
