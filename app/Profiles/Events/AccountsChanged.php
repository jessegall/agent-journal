<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A saved account of a program changed what its owner sees: chosen, renamed, signed in or removed. It names the
 * program and the account by id alone, once the change has committed.
 */
final readonly class AccountsChanged implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $program,
        public string $accountId,
    ) {}
}
