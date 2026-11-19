<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RetryAccountCleanup;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\Account;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class RetryAccountCleanupHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(RetryAccountCleanup $command): void
    {
        $account = Account::lockedForChange($command->accountId);
        $account->retryCleanup();
        $this->events->dispatch(new AccountsChanged($account->program, $account->id));
    }
}
