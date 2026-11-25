<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\AccountWriterEvent;

/**
 * A sign-in attempt became the one that may write an account's folder.
 */
final readonly class AccountWriterClaimed implements AccountEvent, AccountWriterEvent
{
    public function __construct(public string $driver, public string $accountId, public string $attemptId) {}
}
