<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\AccountSignInEvent;
use App\Accounts\Contracts\ShownOnAccounts;

/**
 * A sign-in completed on a saved account, new or reconnected.
 */
final readonly class AccountSignedIn implements AccountEvent, AccountSignInEvent, ShownOnAccounts
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
