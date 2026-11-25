<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Navigation\ClientUpdate;

/**
 * A saved account of a driver changed what its owner sees: chosen, renamed, signed in or removed. It names the
 * driver and the account by id alone, once the change has committed.
 */
final readonly class AccountsChanged implements AccountEvent, ClientUpdate
{
    public function __construct(
        public string $driver,
        public string $accountId,
    ) {}
}
