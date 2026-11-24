<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RecordUsageWindow;

use App\Contracts\Bus\CommandHandler;
use App\Support\UsageReadings;
use App\Support\UsageReportAccounts;

/**
 * Keeps a reported limit window under the saved account of the start the host claimed; a window of an earlier
 * sign-in generation than the account's is acknowledged and ignored.
 */
final readonly class RecordUsageWindowHandler implements CommandHandler
{
    public function __construct(private UsageReportAccounts $accounts, private UsageReadings $readings) {}

    public function handle(RecordUsageWindowCommand $command): void
    {
        $account = $this->accounts->accountOf($command->start);

        $this->readings->recordWindow($account, $command->start->generation, $command->reading);
    }
}
