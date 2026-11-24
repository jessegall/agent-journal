<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\ShownOnAccounts;

/**
 * A saved account was held for maintenance, out of use until it is let go.
 */
final readonly class AccountHeldForMaintenance extends AccountEvent implements ShownOnAccounts
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
