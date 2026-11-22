<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\ShownOnAccounts;

/**
 * A saved account's cleanup moved on in its generation.
 */
final readonly class AccountCleaned implements ShownOnAccounts
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
