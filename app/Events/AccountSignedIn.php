<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\AccountSignInEvent;
use App\Contracts\Accounts\ShownOnAccounts;

/**
 * A sign-in completed on a saved account, new or reconnected.
 */
final readonly class AccountSignedIn extends AccountEvent implements AccountSignInEvent, ShownOnAccounts
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
