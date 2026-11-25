<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\AccountWriterEvent;

/**
 * The sign-in attempt that wrote an account's folder let it go.
 */
final readonly class AccountWriterReleased implements AccountEvent, AccountWriterEvent
{
    public function __construct(public string $driver, public string $accountId, public string $attemptId) {}
}
