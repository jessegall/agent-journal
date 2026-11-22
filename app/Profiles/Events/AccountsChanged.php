<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A saved account of a driver changed what its owner sees: chosen, renamed, signed in or removed. It names the
 * driver and the account by id alone, once the change has committed.
 */
final readonly class AccountsChanged implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $driver,
        public string $accountId,
    ) {}
}
