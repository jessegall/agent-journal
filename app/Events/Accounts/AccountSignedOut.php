<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\AccountSignInEvent;
use App\Contracts\Accounts\ShownOnAccounts;

/**
 * A check of a saved account found it signed out: it needs a new sign-in.
 */
final readonly class AccountSignedOut extends AccountEvent implements AccountSignInEvent, ShownOnAccounts
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
