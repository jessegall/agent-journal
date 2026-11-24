<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Accounts\ShownOnAccounts;
use App\Contracts\Events\Listener;
use App\Events\AccountsChanged;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Tells the owner's Accounts page to reread when a committed Profiles fact it shows arrives, naming the driver and
 * the account, attempt or notice the fact is about.
 */
final readonly class ProjectAccountsChanged implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(ShownOnAccounts $fact): void
    {
        $this->events->dispatch(new AccountsChanged($fact->driver(), $fact->subjectId()));
    }
}
