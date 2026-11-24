<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\ShownOnAccounts;

/**
 * The owner chose another saved account as the driver's active one.
 */
final readonly class AccountSwitched extends AccountEvent implements ShownOnAccounts
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
