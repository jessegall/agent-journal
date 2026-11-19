<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReconcileStarts;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\ProcessStart;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Ends the reported starts and tells each account's page once its count changed.
 */
final readonly class ReconcileStartsHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(ReconcileStarts $command): int
    {
        $accounts = ProcessStart::stopProven($command->hostId, $command->stoppedStartKeys);

        foreach ($accounts as $account) {
            $this->events->dispatch(new AccountUseChanged($account));
        }

        return count($accounts);
    }
}
